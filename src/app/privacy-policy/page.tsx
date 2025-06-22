import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Welcome to Statify ("we," "our," or "us"). This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our music statistics application and
              website (the "Service"). By using Statify, you agree to the
              collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Information from Spotify
              </h3>
              <p className="text-muted-foreground mb-3">
                When you connect your Spotify account to Statify, we collect and
                process the following information through Spotify's API:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Your Spotify profile information (display name, email, profile
                  picture)
                </li>
                <li>
                  Your music listening history and currently playing tracks
                </li>
                <li>Your top tracks and artists</li>
                <li>Your playlists (name and metadata only)</li>
                <li>Your music library and saved tracks</li>
                <li>Playback information and device details</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Account Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address (from your Spotify account)</li>
                <li>Profile information (display name, profile picture)</li>
                <li>Authentication tokens and session data</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>How you interact with our Service</li>
                <li>Features you use and preferences you set</li>
                <li>Time and frequency of your visits</li>
                <li>Device information (browser type, operating system)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and maintain our Service</li>
              <li>Display your music statistics and listening insights</li>
              <li>Generate personalized music analytics and recommendations</li>
              <li>Authenticate your identity and manage your account</li>
              <li>Improve our Service and develop new features</li>
              <li>
                Respond to your comments, questions, and customer service
                requests
              </li>
              <li>Send you technical notices and security alerts</li>
              <li>
                Monitor and analyze usage patterns to improve user experience
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information only in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>With your consent:</strong> When you explicitly agree to
                share information
              </li>
              <li>
                <strong>Service providers:</strong> With trusted third-party
                services that help us operate our Service (hosting, analytics)
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law or to
                protect our rights and safety
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with any
                merger, sale, or acquisition of our company
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security
              measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication using industry-standard protocols</li>
              <li>Regular security assessments and updates</li>
              <li>
                Limited access to personal information on a need-to-know basis
              </li>
              <li>Secure cloud infrastructure with leading providers</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We retain your information for as long as necessary to provide our
              Service and fulfill the purposes outlined in this Privacy Policy.
              When you delete your account, we will delete your personal
              information within 30 days, except for data we are required to
              retain for legal or regulatory purposes.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Access:</strong> Request a copy of your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                portable format
              </li>
              <li>
                <strong>Withdraw consent:</strong> Disconnect your Spotify
                account at any time
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from non-essential
                communications
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at{" "}
              <Link
                href="mailto:privacy@statify.com"
                className="text-primary hover:underline"
              >
                privacy@statify.com
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Spotify</h3>
              <p className="text-muted-foreground">
                Our Service integrates with Spotify's API to access your music
                data. Please review{" "}
                <Link
                  href="https://www.spotify.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Spotify's Privacy Policy
                </Link>{" "}
                to understand how they handle your information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Analytics Services</h3>
              <p className="text-muted-foreground">
                We may use third-party analytics services to understand how our
                Service is used. These services may collect information about
                your usage patterns in an anonymized format.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintain your login session</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how our Service is used</li>
              <li>Improve website performance and user experience</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings, but some
              features may not work properly if cookies are disabled.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our Service is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately so we can delete such information.
            </p>
          </CardContent>
        </Card>

        {/* International Data Transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              International Data Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries
              other than your own. We ensure that such transfers comply with
              applicable data protection laws and implement appropriate
              safeguards to protect your information.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Changes to This Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the "Last updated" date. We
              encourage you to review this Privacy Policy periodically for any
              changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:privacy@statify.com"
                  className="text-primary hover:underline"
                >
                  privacy@statify.com (fake)
                </Link>
              </p>
              <p>
                <strong>Support:</strong>{" "}
                <Link
                  href="mailto:support@statify.com"
                  className="text-primary hover:underlsine"
                >
                  support@statify.com (fake)
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
