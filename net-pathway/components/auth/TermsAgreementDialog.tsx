import React, { useState } from "react";
import { X, Check, AlertTriangle } from "lucide-react";

interface TermsAgreementDialogProps {
  onAccept: (accepted: boolean) => void;
  accepted: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const TermsAgreementDialog: React.FC<TermsAgreementDialogProps> = ({
  onAccept,
  accepted,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-sky-800">
            Terms of Service & Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content with scrollbar */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-700">
          <h2 className="text-xl font-bold mb-4 text-sky-800">NET PATHWAY</h2>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            TERMS OF SERVICE, PRIVACY POLICY, AND USER AGREEMENT
          </h3>
          <p className="text-sm text-gray-500 italic mb-6">
            Last Updated: March 27, 2025
          </p>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              1. INTRODUCTION
            </h3>
            <p className="mb-3">
              Welcome to Net Pathway (hereinafter referred to as "we," "our," or
              "us"). Net Pathway is a career guidance platform designed to help
              students make informed decisions about their educational and
              career paths. This document constitutes a legally binding
              agreement between you and Net Pathway.
            </p>
            <p className="mb-3">
              This Terms of Service, Privacy Policy, and User Agreement
              (hereinafter referred to as the "Agreement") governs your access
              to and use of our website, mobile application, and related
              services (collectively, the "Service"). By accessing or using our
              Service, you acknowledge that you have read, understood, and agree
              to be bound by this Agreement in its entirety. If you do not agree
              to these terms, you must not use our Service.
            </p>
            <p className="mb-3">
              We reserve the right, at our sole discretion, to modify this
              Agreement at any time. It is your responsibility to review this
              Agreement periodically. Your continued use of the Service
              following the posting of any modifications constitutes acceptance
              of those changes.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              2. ELIGIBILITY AND ACCOUNT REGISTRATION
            </h3>
            <p className="mb-3">
              <strong>2.1 Eligibility:</strong> Our Service is intended for
              users who are at least 13 years of age. If you are under 18 years
              of age, you hereby represent and warrant that you have obtained
              the consent of your parent or legal guardian to use our Service
              and that they have read and agreed to this Agreement on your
              behalf. We reserve the right to request proof of such consent at
              any time and to terminate your account if adequate proof is not
              provided.
            </p>
            <p className="mb-3">
              <strong>2.2 Account Registration:</strong> To access certain
              features of our Service, you must create an account. During the
              registration process, you agree to provide accurate, current, and
              complete information as prompted by the registration form (such
              information being the "Registration Data") and to maintain and
              promptly update the Registration Data to keep it accurate,
              current, and complete. You acknowledge that failure to do so
              constitutes a breach of this Agreement, which may result in
              immediate termination of your account.
            </p>
            <p className="mb-3">
              <strong>2.3 Account Security:</strong> You are solely responsible
              for maintaining the confidentiality of your password and account.
              You agree to notify us immediately of any unauthorized use of your
              account or any other breach of security. We will not be liable for
              any loss that you may incur as a result of someone else using your
              password or account, either with or without your knowledge.
              However, you may be held liable for losses incurred by us or
              another party due to someone else using your account or password.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              3. USER CONTENT AND CONDUCT
            </h3>
            <p className="mb-3">
              <strong>3.1 User Content:</strong> By submitting, posting, or
              displaying content on or through our Service ("User Content"), you
              grant us a worldwide, non-exclusive, royalty-free license (with
              the right to sublicense) to use, copy, reproduce, process, adapt,
              modify, publish, transmit, display, and distribute such content in
              any and all media or distribution methods now known or later
              developed. This license is granted for the purpose of operating,
              promoting, and improving our Service.
            </p>
            <p className="mb-3">
              <strong>3.2 Representations Regarding User Content:</strong> You
              represent and warrant that: (i) you own the User Content posted by
              you on or through the Service or otherwise have the right to grant
              the rights and licenses set forth in this Agreement; (ii) the
              posting of your User Content on or through the Service does not
              violate the privacy rights, publicity rights, copyrights, contract
              rights, intellectual property rights, or any other rights of any
              person; and (iii) the posting of your User Content does not result
              in a breach of contract between you and a third party.
            </p>
            <p className="mb-3">
              <strong>3.3 Prohibited Content and Conduct:</strong> You agree not
              to use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>
                Post, upload, or share content that is illegal, harmful,
                threatening, abusive, harassing, defamatory, vulgar, obscene,
                invasive of another's privacy, or otherwise objectionable
              </li>
              <li>
                Impersonate any person or entity or falsely state or
                misrepresent your affiliation with a person or entity
              </li>
              <li>
                Violate any applicable laws or regulations, including
                intellectual property laws
              </li>
              <li>
                Upload or transmit viruses, malware, or other malicious code
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks
                connected to the Service
              </li>
              <li>
                Engage in any data mining, scraping, or similar data gathering
                activities
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service or any other systems or networks connected to the
                Service
              </li>
            </ul>
            <p className="mb-3">
              <strong>3.4 Content Removal:</strong> We reserve the right, but
              not the obligation, to monitor the User Content and to remove any
              User Content that we determine, in our sole discretion, violates
              this Agreement or is otherwise objectionable. We also reserve the
              right to terminate a user's access to all or part of the Service
              for violating this Agreement.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              4. INTELLECTUAL PROPERTY RIGHTS
            </h3>
            <p className="mb-3">
              <strong>4.1 Our Intellectual Property:</strong> The Service and
              its original content (excluding User Content), features, and
              functionality are and will remain the exclusive property of Net
              Pathway and its licensors. The Service is protected by copyright,
              trademark, and other laws of both Rwanda and foreign countries.
              Our trademarks and trade dress may not be used in connection with
              any product or service without our prior written consent.
            </p>
            <p className="mb-3">
              <strong>4.2 Feedback:</strong> Any feedback, comments, or
              suggestions you may provide regarding the Service is entirely
              voluntary, and we shall be free to use such feedback, comments, or
              suggestions as we see fit and without any obligation to you. By
              providing such feedback, you hereby assign to us all rights in the
              feedback and agree that we shall have the right to use such
              feedback and related information in any manner we deem appropriate
              without restriction or compensation to you.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              5. PRIVACY POLICY
            </h3>
            <p className="mb-3">
              Our Privacy Policy, which explains how we collect, use, and
              disclose information from our users, is incorporated by reference
              into this Agreement. You acknowledge and agree that your use of
              the Service is subject to our Privacy Policy, which can be found
              below.
            </p>
            <p className="mb-3">
              <strong>5.1 Information We Collect:</strong> We collect the
              following types of information:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                educational background, and career interests provided during
                registration and assessment
              </li>
              <li>
                <strong>Usage Information:</strong> Information about how you
                use the Service, including log data, device information, and
                analytics
              </li>
              <li>
                <strong>Assessment Data:</strong> Responses to career
                assessments, personality tests, and skill evaluations
              </li>
            </ul>
            <p className="mb-3">
              <strong>5.2 How We Use Your Information:</strong> We use your
              information to:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>Provide, maintain, and improve our Service</li>
              <li>
                Generate personalized career and educational recommendations
              </li>
              <li>Communicate with you about the Service</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mb-3">
              <strong>5.3 Data Sharing and Disclosure:</strong> We may share
              your information with:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>Service providers who perform services on our behalf</li>
              <li>
                Educational institutions and potential employers, with your
                explicit consent
              </li>
              <li>In response to legal process or government request</li>
              <li>
                To protect our rights, property, or safety, or the rights,
                property, or safety of others
              </li>
            </ul>
            <p className="mb-3">
              <strong>5.4 Data Security:</strong> We implement appropriate
              technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure,
              or destruction. These measures include encryption of personal
              data, access controls, and regular security assessments. However,
              no method of transmission over the Internet or electronic storage
              is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p className="mb-3">
              <strong>5.5 Data Retention:</strong> We retain your personal
              information for as long as necessary to fulfill the purposes
              outlined in this Agreement, unless a longer retention period is
              required or permitted by law. You can request deletion of your
              data at any time through our Service.
            </p>
            <p className="mb-3">
              <strong>5.6 Children's Privacy:</strong> Our Service is not
              directed to children under 13. We do not knowingly collect
              personal information from children under 13. If we learn that we
              have collected personal information from a child under 13, we will
              take steps to delete such information.
            </p>
            <p className="mb-3">
              <strong>5.7 Your Data Rights:</strong> Depending on your location,
              you may have certain rights regarding your personal information,
              including:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your information</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
            </ul>
            <p className="mb-3">
              To exercise these rights, please contact us using the information
              provided in Section 12.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              6. ALGORITHMIC TRANSPARENCY
            </h3>
            <p className="mb-3">
              <strong>6.1 AI-Driven Recommendations:</strong> Our Service
              utilizes artificial intelligence algorithms to generate
              personalized career and educational recommendations. These
              recommendations are based on:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>Information you provide during assessments</li>
              <li>Your interactions with the Service</li>
              <li>Educational and labor market data</li>
              <li>Statistical models and pattern recognition</li>
            </ul>
            <p className="mb-3">
              <strong>6.2 Bias Mitigation:</strong> We implement rigorous
              testing protocols to ensure our recommendations are free from
              gender, ethnic, socioeconomic, or other biases. We regularly audit
              our algorithms and make adjustments as necessary to maintain
              fairness and accuracy. However, we do not guarantee that our
              recommendations are entirely free from all potential biases, as
              algorithmic systems inherently reflect patterns present in their
              training data.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              7. THIRD-PARTY LINKS AND SERVICES
            </h3>
            <p className="mb-3">
              Our Service may contain links to third-party websites, services,
              or resources that are not owned or controlled by Net Pathway. We
              are not responsible for the content, privacy policies, or
              practices of any third-party websites or services. You acknowledge
              and agree that we shall not be responsible or liable, directly or
              indirectly, for any damage or loss caused or alleged to be caused
              by or in connection with the use of or reliance on any such
              content, goods, or services available on or through any such
              websites or services.
            </p>
            <p className="mb-3">
              We strongly advise you to read the terms and conditions and
              privacy policies of any third-party websites or services that you
              visit or engage with.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              8. DISCLAIMERS
            </h3>
            <p className="mb-3">
              <strong>8.1 No Guarantee of Outcomes:</strong> While we strive to
              provide accurate and helpful career guidance, we do not guarantee
              specific educational or career outcomes as a result of using our
              Service. Career decisions should be made in consultation with
              appropriate educational and professional advisors. The information
              provided through our Service is intended for general informational
              purposes only and should not be relied upon as the sole basis for
              making important career or educational decisions.
            </p>
            <p className="mb-3">
              <strong>8.2 Service Availability:</strong> We do not guarantee
              that our Service will be available, uninterrupted, timely, secure,
              or error-free. We reserve the right to suspend or terminate access
              to the Service, in whole or in part, at any time and for any
              reason without notice. We will not be liable if, for any reason,
              all or any part of the Service is unavailable at any time or for
              any period.
            </p>
            <p className="mb-3">
              <strong>8.3 General Disclaimer:</strong> THE SERVICE AND ALL
              CONTENT, FEATURES, AND FUNCTIONALITY THEREOF ARE PROVIDED "AS IS"
              AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
              OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE IS FREE OF
              VIRUSES OR OTHER HARMFUL COMPONENTS. NO ADVICE OR INFORMATION,
              WHETHER ORAL OR WRITTEN, OBTAINED FROM US OR THROUGH THE SERVICE
              WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              9. LIMITATION OF LIABILITY
            </h3>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL NET PATHWAY, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
              SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>
                YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                SERVICE
              </li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
              <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
              <li>
                UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR
                CONTENT
              </li>
            </ul>
            <p className="mb-3">
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
              OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF
              THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH
              HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
            </p>
            <p className="mb-3">
              IN JURISDICTIONS WHERE THE EXCLUSION OR LIMITATION OF LIABILITY
              FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES IS NOT ALLOWED, OUR
              LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              10. INDEMNIFICATION
            </h3>
            <p className="mb-3">
              You agree to defend, indemnify, and hold harmless Net Pathway, its
              directors, officers, employees, and agents from and against any
              and all claims, damages, obligations, losses, liabilities, costs
              or debt, and expenses (including but not limited to attorney's
              fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>Your use of and access to the Service</li>
              <li>Your violation of any term of this Agreement</li>
              <li>
                Your violation of any third-party right, including without
                limitation any copyright, property, or privacy right
              </li>
              <li>
                Any claim that your User Content caused damage to a third party
              </li>
            </ul>
            <p className="mb-3">
              This defense and indemnification obligation will survive the
              termination of this Agreement and your use of the Service.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              11. MODIFICATIONS TO THE AGREEMENT
            </h3>
            <p className="mb-3">
              We reserve the right, at our sole discretion, to modify or replace
              this Agreement at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p className="mb-3">
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use the Service.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              12. CONTACT INFORMATION
            </h3>
            <p className="mb-3">
              If you have any questions about this Agreement or our Service,
              please contact us at:
            </p>
            <p className="mb-3">
              Email: support@netpathway.com
              <br />
              Address: Kigali, Rwanda
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              13. GOVERNING LAW AND DISPUTE RESOLUTION
            </h3>
            <p className="mb-3">
              This Agreement shall be governed by and construed in accordance
              with the laws of Rwanda, without regard to its conflict of law
              provisions.
            </p>
            <p className="mb-3">
              Any dispute arising out of or relating to this Agreement shall
              first be attempted to be resolved through informal negotiation. If
              the dispute cannot be resolved through negotiation, then the
              dispute shall be resolved through arbitration in accordance with
              the rules of the Rwanda Arbitration Centre. The place of
              arbitration shall be Kigali, Rwanda. The arbitration shall be
              conducted in English. The decision of the arbitrator shall be
              final and binding on the parties.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              14. SEVERABILITY
            </h3>
            <p className="mb-3">
              If any provision of this Agreement is held to be invalid or
              unenforceable by a court, the remaining provisions of this
              Agreement will remain in effect. The invalid or unenforceable
              provision shall be replaced by a valid, enforceable provision that
              most closely matches the intent of the original provision.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              15. ENTIRE AGREEMENT
            </h3>
            <p className="mb-3">
              This Agreement constitutes the entire agreement between you and
              Net Pathway regarding our Service and supersedes and replaces any
              prior agreements we might have had between us regarding the
              Service.
            </p>
          </section>

          <div className="text-base font-bold mt-8 mb-4 text-center">
            BY USING THE NET PATHWAY SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ
            THIS AGREEMENT, UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS TERMS
            AND CONDITIONS.
          </div>
        </div>

        {/* Footer with accept button */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            onClick={() => onAccept(!accepted)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`h-5 w-5 rounded flex items-center justify-center border ${
                accepted ? "bg-sky-100 border-sky-500" : "border-gray-300"
              }`}
            >
              {accepted && <Check className="h-4 w-4 text-sky-600" />}
            </div>
            <span className="text-gray-700">
              I have read and agree to the Terms of Service & Privacy Policy
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAccept(true);
                onClose();
              }}
              disabled={accepted}
              className={`px-4 py-2 rounded-lg ${
                accepted
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {/* Warning indicator if not accepted */}
      {!accepted && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-50 border border-amber-200 shadow-md rounded-lg px-4 py-3 flex items-center gap-2 z-50">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span className="text-amber-800">
            You must accept the terms to continue
          </span>
        </div>
      )}
    </div>
  );
};

export default TermsAgreementDialog;
