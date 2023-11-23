export async function _joinRoom(roomId, accessToken) {
    try {
      const result = await fetch(
        `${
          import.meta.env.VITE_MOMENTIFY_API_URL
        }/matrix/joinRoom?matrixAuthToken=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"          
          },
          body: JSON.stringify({
            room_id: roomId
          }),
        }
      );
      return result.json();
    } catch (err) {
      console.error({ joinRoomError: err });
    }
  }