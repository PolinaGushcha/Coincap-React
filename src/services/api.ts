const COINCAP_API_KEY = process.env.REACT_APP_COINCAP_API_KEY;

export const fetchCoincapApi = async (id: string = '') => {
      const response = await fetch(`https://rest.coincap.io/v3/assets/${id}`, {
        headers: {
          Authorization: `Bearer ${COINCAP_API_KEY}`,
        },
      });
      if(!response.ok) {
        throw new Response('', {status: response.status, statusText: response.statusText})
      }
      return await response.json();
  }