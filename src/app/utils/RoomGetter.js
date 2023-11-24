export const extractRoomIDFromURL = (url) => {
	const urlParams = new URLSearchParams(url.split('?')[1]);
	const roomID = urlParams.get('roomID');
	return roomID;
};