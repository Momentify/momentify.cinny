export const extractRoomIDFromURL = (url) => {
	const urlParams = new URLSearchParams(url.split('?')[1]);
	const roomID = urlParams.get('roomID');
	return roomID;
};

export const extractRoomIDFromURLWithoutParam = (url) => {
	const _url = new URL(url);

	// Split the pathname by '/' and filter out empty strings
	const pathSegments = _url.pathname.split('/').filter(segment => segment.length > 0);

	// Get the last segment
	const lastSegment = pathSegments.pop();

	return lastSegment;
};