class DataFetcher {
  static getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not complete fetch request - Status: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.plans !== undefined && data.plans.length === 0) {
      Renderer.routeErrorMessage.set('No routes available')
      Renderer.renderPage();
      throw new Error('No plans available');
    }

    return data;
  }
}