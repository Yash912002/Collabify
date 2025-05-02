## Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env.local` file in **root** directory.
4. Contents of `.env.local`:

```env
# .env.local

# disabled next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# deployment used by `npx convex dev` or `bunx convex dev`
CONVEX_DEPLOYMENT=dev:<deployment-name> # team: <team-name>, project: <project-name>

# convex public url
NEXT_PUBLIC_CONVEX_URL="https://<deployment-name>.convex.cloud"

```

5. Convex Deployment

- Visit the Convex website: [https://convex.dev](https://convex.dev)
- Log in to your Convex account or sign up if you don't have one.
- Once logged in, navigate to the "Deployments" section.
- Create a new deployment or select an existing one.
- Replace `<deployment-name>`, `<team-name>`, and `<project-name>` in the `.env.local` file with your Convex deployment details.
- In the Convex dashboard, find the public URL associated with your deployment.
- Replace `<your-convex-url>` in the `.env.local` file with your Convex public URL.

6. Initialise Convex Auth Development Keys

- Run the initialization command: `npx @convex-dev/auth` to setup your project for authenticating via the library.
- Make sure your **SITE_URL** environment variable is set correctly. This is the URL where your app is hosted, e.g., `http://localhost:3000` for development.
- Your project authentication is setup for logging in with credentials.

7. Setting Up Google OAuth

    **Step 1: Create a Google Cloud Project**
  
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project (if you don’t have one) by clicking on **Select a project** > **New Project**, and give it a name.
    - Enable the **Google OAuth 2.0** API by navigating to **APIs & Services > Library** and searching for **Google OAuth 2.0**.

    **Step 2: Create OAuth Credentials**
    
    - In the **APIs & Services > Credentials** section, click **Create Credentials** and choose **OAuth 2.0 Client IDs**.
    - Select **Web Application** as the application type.
    - Set the **Authorized Redirect URI** to your Convex callback URL. The origin (domain) of the callback URL is your Convex backend's **HTTP Actions URL**. You can find it in your Convex dashboard and it is similar to your `CONVEX_URL`, but with `.site` instead of `.cloud`.

    - After setting the redirect URI, click **Create**. You’ll be provided with a **Client ID** and **Client Secret**.

    **Step 3: Set Google OAuth Environment Variables in Convex**
    To configure Google OAuth in your Convex backend, run the following commands with your actual values:

```bash
npx convex env set AUTH_GOOGLE_CLIENT_ID your-google-client-id
npx convex env set AUTH_GOOGLE_CLIENT_SECRET your-google-client-secret
```

8. Setting Up GitHub OAuth

    **Step 1: Create a GitHub OAuth Application**
    
    - Go to [GitHub Developer Settings](https://github.com/settings/developers).
    - Under **OAuth Apps**, click **New OAuth App**.
    - Fill in the following:
    
      - **Application Name**: Name your app (e.g., "Slack Clone").
      - **Homepage URL**: Your app’s homepage URL, like `http://localhost:3000` for local development.
      - **Authorization Callback URL**: Set this to your Convex callback URL (Similar to Google OAuth **Authorized Redirect URI**).
    
    - After registering the app, you’ll get a **Client ID** and **Client Secret**.

    **Step 2: Set GitHub OAuth Environment Variables in Convex**
    
    - To configure GitHub OAuth in your Convex backend, run the following commands with your actual values:
    
    ```bash
    npx convex env set AUTH_GITHUB_ID your-github-client-id
    npx convex env set AUTH_GITHUB_SECRET your-github-client-secret
    ```
    
9. Install Project Dependencies using `npm install --legacy-peer-deps`.

10. Now run `npm run dev`.
