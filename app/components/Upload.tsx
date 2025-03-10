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
		console.log('Authentication response:', data);
		if (!data.signature || !data.expire || !data.token) {
			throw new Error('Invalid authentication response');
		}
		return {
			signature: data.signature,
			expire: data.expire,
			token: data.token,
		};
	} catch (error: unknown) {
		console.error('Authenticator error:', error);
		throw new Error(
			`Authentication request failed: ${(error as Error).message}`
		);
	}
};

interface ImgState {
	isLoading: boolean;
	error: string;
	dbData: { filePath?: string };
	aiData: { inlineData?: { data: string; mimeType: string } };
}

interface UploadResponse {
	filePath?: string;
	url: string;
	fileType: string;
}

const Upload: React.FC<{ setImg: (img: ImgState) => void }> = ({ setImg }) => {
	const ikUploadRef = useRef<HTMLInputElement>(null);

	const onError = (err: Error) => {
		console.error('Upload Error:', err);
		setImg({
			isLoading: false,
			error: err.message || 'Failed to upload image',
			dbData: {},
			aiData: {},
		});
	};

	const onSuccess = async (res: UploadResponse) => {
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
				mimeType = 'image/png';
			} else if (
				!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)
			) {
				console.warn(
					`Unsupported mimeType "${mimeType}", defaulting to image/png`
				);
				mimeType = 'image/png';
			}

			console.log('Final mimeType set:', mimeType);

			setImg({
				isLoading: false,
				error: '',
				dbData: { filePath: res.filePath || res.url },
				aiData: {
					inlineData: {
						data: base64Data,
						mimeType: mimeType,
					},
				},
			});
		};
	};

	const onUploadProgress = (progress: ProgressEvent) => {
		console.log('Upload Progress:', progress);
	};

	const onUploadStart = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const file = evt.target.files?.[0];
		if (file) {
			setImg({
				isLoading: true,
				error: '',
				dbData: {},
				aiData: {},
			});
		}
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
