class DataFetcher {
  static getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not complete fetch request - Status: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  }
}