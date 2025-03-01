'use client';

import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';
import { Paperclip } from 'lucide-react';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
	console.error('Missing environment variables:', { urlEndpoint, publicKey });
	throw new Error(
		'NEXT_PUBLIC_IMAGE_KIT_ENDPOINT and NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY must be set in .env'
	);
}

const authenticator = async () => {
	try {
		console.log(
			'Fetching authentication from:',
			`${process.env.NEXT_PUBLIC_API_URL}/api/upload`
		);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
			{
				method: 'GET',
				credentials: 'include',
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Request failed with status ${response.status}: ${errorText}`
			);
		}

		const data = await response.json();
		if (!data.signature || !data.expire || !data.token) {
			throw new Error('Invalid authentication response');
		}
		return {
			signature: data.signature,
			expire: data.expire,
			token: data.token,
		};
	} catch (error: any) {
		console.error('Authenticator error:', error);
		throw new Error(`Authentication request failed: ${error.message}`);
	}
};

const Upload: React.FC<{ setImg: (img: any) => void }> = ({ setImg }) => {
	const ikUploadRef = useRef<HTMLInputElement>(null);

	const onError = (err: any) => {
		console.error('Upload Error:', err);
		setImg((prev: any) => ({
			...prev,
			isLoading: false,
			error: err.message || 'Failed to upload image',
		}));
	};

	const onSuccess = async (res: any) => {
		console.log('Upload Success:', res);
		console.log('Raw fileType from ImageKit:', res.fileType);

		const imageResponse = await fetch(res.url);
		const imageBlob = await imageResponse.blob();
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob);
		reader.onloadend = () => {
			const base64Data = (reader.result as string).split(',')[1];
			let mimeType = res.fileType?.toLowerCase() || 'image/png';
			if (!mimeType.startsWith('image/') || mimeType === 'image') {
				mimeType = 'image/png'; // Default to PNG if invalid or vague
			} else if (
				!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)
			) {
				console.warn(
					`Unsupported mimeType "${mimeType}", defaulting to image/png`
				);
				mimeType = 'image/png';
			}

			console.log('Final mimeType set:', mimeType);

			setImg((prev: any) => ({
				...prev,
				isLoading: false,
				dbData: { filePath: res.filePath || res.url },
				aiData: {
					inlineData: {
						data: base64Data,
						mimeType: mimeType,
					},
				},
			}));
		};
	};

	const onUploadProgress = (progress: any) => {
		console.log('Upload Progress:', progress);
	};

	const onUploadStart = () => {
		setImg((prev: any) => ({
			...prev,
			isLoading: true,
			error: '',
		}));
	};

	return (
		<IKContext
			urlEndpoint={urlEndpoint}
			publicKey={publicKey}
			authenticator={authenticator}>
			<IKUpload
				fileName='chat-upload.png'
				onError={onError}
				onSuccess={onSuccess}
				useUniqueFileName={true}
				onUploadProgress={onUploadProgress}
				onUploadStart={onUploadStart}
				style={{ display: 'none' }}
				ref={ikUploadRef}
			/>
			<label
				onClick={() => ikUploadRef.current?.click()}
				className='cursor-pointer text-purple-400 hover:text-purple-300 transition-colors duration-200'>
				<Paperclip className='w-7 h-7 pr-2' />
			</label>
		</IKContext>
	);
};

export default Upload;
