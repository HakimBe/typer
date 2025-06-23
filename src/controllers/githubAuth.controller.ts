import { Request, Response } from "express";
import axios from "axios";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  "http://localhost:3000/auth/github/callback";

export const redirectToGitHub = (req: Request, res: Response) => {
  const scope = "repo workflow";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
  res.redirect(authUrl);
};

export const handleGitHubCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).json({ message: "Missing code" });
    return;
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = response.data.access_token;

    // TODO: Link to user in DB
    res.json({ token: accessToken });
  } catch (err) {
    res
      .status(500)
      .json({ message: "GitHub token exchange failed", error: err });
    return;
  }
};
