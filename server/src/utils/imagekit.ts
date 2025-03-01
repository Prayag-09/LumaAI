import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

const { URL_ENDPOINT, PUBLIC_KEY, PRIVATE_KEY } = process.env;

if (!URL_ENDPOINT || !PUBLIC_KEY || !PRIVATE_KEY) {
	console.warn(
		'Warning: Missing ImageKit configuration. Check environment variables.'
	);
}

const imagekit = new ImageKit({
	urlEndpoint: URL_ENDPOINT ?? '',
	publicKey: PUBLIC_KEY ?? '',
	privateKey: PRIVATE_KEY ?? '',
});

export default imagekit;
