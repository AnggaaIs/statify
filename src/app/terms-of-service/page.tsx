import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
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
            <CardTitle className="text-xl">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              These Terms of Service ("Terms") govern your use of the Statify
              application and website (the "Service") operated by Statify ("we,"
              "our," or "us"). By accessing or using our Service, you agree to
              be bound by these Terms. If you disagree with any part of these
              terms, then you may not access the Service.
            </p>
          </CardContent>
        </Card>

        {/* Description of Service */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Statify is a music statistics and analytics application that
              connects to your Spotify account to provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Detailed insights into your music listening habits</li>
              <li>Analysis of your top tracks, artists, and genres</li>
              <li>Real-time display of currently playing music</li>
              <li>Historical listening data and trends</li>
              <li>Personalized music statistics and recommendations</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Creation</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  You must have a valid Spotify account to use our Service
                </li>
                <li>You must be at least 13 years old to create an account</li>
                <li>
                  You are responsible for maintaining the security of your
                  account
                </li>
                <li>You must provide accurate and complete information</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Account Responsibilities
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  You are responsible for all activities that occur under your
                  account
                </li>
                <li>You must notify us immediately of any unauthorized use</li>
                <li>You may not share your account credentials with others</li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  violate these Terms
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Acceptable Use Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You agree not to use the Service for any of the following
              prohibited activities:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing on intellectual property rights</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with or disrupting the Service</li>
              <li>Using automated scripts or bots without permission</li>
              <li>Reverse engineering or attempting to extract source code</li>
              <li>Distributing malware, viruses, or harmful code</li>
              <li>Harassing, threatening, or intimidating other users</li>
              <li>
                Using the Service for commercial purposes without authorization
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Spotify Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Spotify Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Third-Party Service
              </h3>
              <p className="text-muted-foreground">
                Our Service integrates with Spotify through their official API.
                By using our Service, you also agree to comply with{" "}
                <Link
                  href="https://www.spotify.com/legal/end-user-agreement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Spotify's Terms of Service
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Access</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  We only access data you explicitly authorize through Spotify's
                  OAuth system
                </li>
                <li>We do not store your Spotify credentials</li>
                <li>
                  You can revoke our access at any time through your Spotify
                  account settings
                </li>
                <li>
                  We are not responsible for changes to Spotify's API or service
                  availability
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Intellectual Property Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Our Content</h3>
              <p className="text-muted-foreground">
                The Service and its original content, features, and
                functionality are owned by Statify and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Content</h3>
              <p className="text-muted-foreground">
                You retain ownership of any content you provide to us. However,
                by using our Service, you grant us a limited, non-exclusive
                license to use your data solely for providing and improving our
                Service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Music Content</h3>
              <p className="text-muted-foreground">
                All music content, including track information, album artwork,
                and metadata, is owned by the respective artists, labels, and
                Spotify. We do not claim ownership of any music content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Privacy and Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              , which also governs your use of the Service, to understand our
              practices regarding the collection, use, and disclosure of your
              personal information.
            </p>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Service Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                We strive to maintain high service availability but cannot
                guarantee 100% uptime
              </li>
              <li>
                We may temporarily suspend the Service for maintenance or
                updates
              </li>
              <li>
                We reserve the right to modify or discontinue features with
                reasonable notice
              </li>
              <li>
                Service availability may be affected by third-party services
                like Spotify
              </li>
              <li>
                We are not liable for any damages resulting from service
                interruptions
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                The Service is provided "as is" without warranties of any kind
              </li>
              <li>
                We disclaim all warranties, express or implied, including
                merchantability and fitness for a particular purpose
              </li>
              <li>
                We shall not be liable for any indirect, incidental, special, or
                consequential damages
              </li>
              <li>
                Our total liability shall not exceed the amount you paid for the
                Service in the past 12 months
              </li>
              <li>
                Some jurisdictions do not allow the exclusion of certain
                warranties or limitations of liability
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless Statify and its
              officers, directors, employees, and agents from and against any
              claims, damages, obligations, losses, liabilities, costs, or debt,
              and expenses (including but not limited to attorney's fees)
              arising from your use of the Service or violation of these Terms.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">By You</h3>
              <p className="text-muted-foreground">
                You may terminate your account at any time by discontinuing use
                of the Service and revoking Spotify access permissions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">By Us</h3>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without
                prior notice, for conduct that we believe violates these Terms
                or is harmful to other users, us, or third parties.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Effect of Termination
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your right to use the Service will cease immediately</li>
                <li>We will delete your account data within 30 days</li>
                <li>
                  Provisions that should survive termination will remain in
                  effect
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Governing Law and Jurisdiction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts located in
              [Your Jurisdiction].
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days
              notice prior to any new terms taking effect. Your continued use of
              the Service after such modifications constitutes acceptance of the
              updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* Severability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Severability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If any provision of these Terms is held to be invalid or
              unenforceable by a court, the remaining provisions will remain in
              effect. The invalid or unenforceable provision will be replaced
              with a valid provision that most closely matches the intent of the
              original provision.
            </p>
          </CardContent>
        </Card>

        {/* Entire Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Entire Agreement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy, constitute the sole
              and entire agreement between you and Statify regarding the Service
              and supersede all prior and contemporaneous understandings,
              agreements, representations, and warranties.
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
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:legal@statify.com"
                  className="text-primary hover:underline"
                >
                  legal@statify.com (fake)
                </Link>
              </p>
              <p>
                <strong>Support:</strong>{" "}
                <Link
                  href="mailto:support@statify.com"
                  className="text-primary hover:underline"
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
