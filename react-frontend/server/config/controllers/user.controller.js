export function allAccess(req, res) {
  res.status(200).send("Public Content.");
}

// export function userBoard(req, res) {
//   res.status(200).send("User Content.");
// }

// In your user.controller.js

export function userBoard(req, res) {
  // Assuming req.user contains user information after verification
  if (req.user) {
    // Construct the URL of the user's page
    const userPageUrl = `/predict_location`; // You can customize the URL structure

    // Send a JSON response with the redirect URL
    res.status(200).json({ redirectUrl: userPageUrl });
  } else {
    // Handle unauthenticated or unauthorized users
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function adminBoard(req, res) {
  res.status(200).send("Admin Content.");
}

export function moderatorBoard(req, res) {
  res.status(200).send("Driver");
}
