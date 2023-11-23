export function allAccess(req, res) {
  res.status(200).send("Public Content.");
}

// driver
export function userBoard(req, res) {
  // Construct the URL of the user's page
  const userPageUrl = `/predict_location`; // You can customize the URL structure

  // Send a JSON response with the redirect URL
  res.status(200).json({ redirectUrl: userPageUrl });
}

export function adminBoard(req, res) {
  res.status(200).send("Admin Content.");
}

// rider
export function moderatorBoard(req, res) {
  const userPageUrl = `/request_ride`; // You can customize the URL structure

  // Send a JSON response with the redirect URL
  res.status(200).json({ redirectUrl: userPageUrl });
}
