# Privacy Policy (Pro)

Last updated: 4 February 2026

Mind Measure Ltd ("we", "us", "our") is committed to protecting the privacy and autonomy of users of the Mind Measure mobile application and related websites (together, the "Services").

This Privacy Policy explains how personal data is collected, used, stored, and protected when you use Mind Measure Pro. It also explains your rights in relation to that data and how others, including employers that deploy Mind Measure Pro, may receive aggregated insight derived from it.

By accessing and using the Services, you agree to the collection, use, storage, and transfer of your personal data under the terms of this Privacy Policy, the Data Protection Act 2018, and the UK General Data Protection Regulation ("UK GDPR").

Please note that this Privacy Policy does not apply to third-party websites accessible via links on our website or within the app. We are not responsible for the privacy practices of those third parties.

## 1. Identity of the data controller

The data controller is:

Mind Measure Ltd
Company No. 16555431
Registered office: 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
ICO registration reference: ZC030610

If you have any questions, concerns, or complaints about how we handle your personal data, you can contact us:

Email: dpo@mindmeasure.co.uk
Post: Mind Measure Ltd, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ

The Information Commissioner's Office (ICO) is the UK's independent regulatory authority for data protection. You can contact the ICO at: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF, or at ico.org.uk, or by telephone on 0303 123 1113.

## 2. Scope of this policy

This Privacy Policy applies to:

- The Mind Measure mobile application
- The Mind Measure Pro websites (including mindmeasurepro.com)
- Related services provided to employees and their employers

Where Mind Measure Pro is used as part of a corporate deployment, this policy applies to individual users of the app. Employers receive aggregated, anonymised insight only, as described below.

Our Services are intended primarily for users aged 18 and over. Please see Section 14 for details on how we handle data relating to younger users.

## 3. What data we collect

Mind Measure collects only the data necessary to provide the Services. We do not collect GPS location data, device contacts, or background data.

### 3.1 Data you provide directly

- Account information, such as your email address
- Responses to validated baseline assessments (PHQ-2 and GAD-2)
- Self-reported mood ratings during daily check-ins
- Voluntary text inputs during check-ins and conversational prompts

### 3.2 Audio data

- The app captures audio during voluntary check-ins, with your explicit consent
- Audio is used for two purposes: (a) transcription into text, performed by ElevenLabs as part of the live check-in conversation, and (b) extraction of acoustic features such as pitch, speech rate, pause duration, and vocal intensity
- Audio files are deleted within 24 hours of processing. No raw audio is stored long-term

### 3.3 Visual data

- The app captures sampled still images (approximately one frame per second) during voluntary check-ins, with your explicit consent
- Images are processed through AWS Rekognition to extract facial landmarks and expression features (such as intensity of emotion categories, eye openness, and head orientation)
- Images are deleted immediately after feature extraction through managed S3 lifecycle policies. No raw images are stored

### 3.4 Derived data

- A personalised Wellbeing Score generated through automated multimodal analysis of text, audio, and visual features, anchored to your validated baseline assessments
- Longitudinal trends based on your scores over time

These outputs are informational and non-clinical. They do not constitute a diagnosis.

### 3.5 Technical data

Device type, operating system version, and authentication identifiers required to operate the Services securely. We do not collect data unrelated to the operation of the Services.

## 4. How we use your data

We use personal data to:

- Provide and operate the Services, including daily check-ins and baseline assessments
- Generate your personal Wellbeing Score and trend information
- Produce aggregated, anonymised insight at team or organisational level for employer dashboards
- Maintain the security, reliability, and performance of the platform
- Comply with legal and regulatory obligations

Mind Measure does not use personal data for advertising, marketing profiling, or sale to third parties. We do not rent or trade data with other organisations.

## 5. Processing special category data

Your Wellbeing Score is derived from data relating to your mental health and emotional state. Under UK GDPR, this constitutes special category data (health data) which requires additional protections.

We process special category data only with your explicit consent under Article 9(2)(a) of the UK GDPR. You provide this consent when you create your account and begin using the check-in features.

We may also process special category data where:

- It is necessary to protect your vital interests in an emergency, if you are physically or legally incapable of giving consent
- It is necessary for the establishment, exercise, or defence of legal claims

You can withdraw your consent at any time by discontinuing use of the app, deleting your account, or contacting us at dpo@mindmeasure.co.uk. Withdrawing consent does not affect the lawfulness of processing carried out before withdrawal.

## 6. Aggregation and organisational insight

Mind Measure Pro is designed to separate individual experience from organisational insight.

- Individual-level data remains private to you at all times
- Employers receive aggregated, anonymised data only
- Minimum group thresholds are enforced before any data is surfaced to an employer. Teams below this threshold are excluded from reporting
- Statistical noise may be applied to aggregated outputs to prevent inference
- Employers cannot access individual responses, scores, check-in content, or media

There is no configuration, permission setting, or user role that allows management users to view individual employee data. Personal wellbeing data and organisational reporting data are stored in separate database tables, accessed through separate roles, with strict row-level security enforced.

## 7. What employers can and cannot access

Employers may access:

- Aggregated wellbeing trends at team, department, division, or organisational level
- Organisation-level patterns over time (e.g., by quarter or reporting period)
- Comparative insight between teams and departments, subject to minimum thresholds
- Aggregated linguistic themes (e.g., workload pressure, management concerns, work-life balance) at population level
- Engagement metrics showing platform adoption rates

Employers cannot access:

- Individual check-in responses or content
- Individual Wellbeing Scores or trajectories
- Audio, video, or text inputs from any employee
- Identifiable or re-identifiable personal data
- Real-time monitoring of any individual employee

Employer dashboards cannot be used for performance review, disciplinary, or progression decisions, or any purpose that would disadvantage individual employees.

## 8. Legal basis for processing

Mind Measure processes personal data on the following legal bases:

### 8.1 Explicit consent (Article 9(2)(a))

Processing of special category data (health and wellbeing data derived from check-ins, audio, and visual analysis) is based on your explicit consent, which you provide when you create your account and activate check-in features.

### 8.2 Performance of the Services

Processing that is necessary for us to deliver the Services to you, including account management, score generation, and trend analysis.

### 8.3 Legitimate interests

Processing that is necessary for our legitimate interests, provided those interests are not overridden by your rights. Our legitimate interests include:

- Delivering, developing, and improving the Services
- Producing management information and platform analytics
- Preventing fraud and ensuring platform security

### 8.4 Legal obligations

Processing that is necessary to comply with legal obligations, including UK data protection law, tax and accounting requirements, and regulatory requests.

## 9. Automated processing

Mind Measure uses automated analysis of text, audio, and visual inputs to generate your Wellbeing Score. The current weighting is approximately 70% text features, 15% audio features, and 15% visual features. These weights reflect the relative reliability and predictive strength of each modality in the research literature.

Your score is calibrated against your own personal baseline, which is established during your first interactions and evolves over time through longitudinal smoothing. This means the system detects changes relative to your own typical patterns, not compared to other employees.

These outputs are informational only. They do not constitute a diagnosis, clinical assessment, or risk classification. No automated decisions with legal or similarly significant effects are made about you. No individual scores or signals are shared with your employer.

You can contact us at any time to ask how automated processing works or to request human review of any concern.

## 10. Data storage and security

Mind Measure operates a fully cloud-native architecture on Amazon Web Services (AWS). All data is stored and processed within UK and EU AWS regions.

Security measures include:

- Encryption at rest using AES-256 via AWS Key Management Service (KMS)
- Field-level encryption for sensitive values (assessment responses, derived features, user identifiers)
- Encryption in transit via TLS 1.2 or higher for all communications
- Structural separation of personal data and aggregated organisational data in separate database tables
- Role-based access control with finely granulated permissions across multiple role types
- Row-level security ensuring each employee can only access their own data
- Amazon Aurora Serverless v2 (PostgreSQL) for encrypted structured storage
- Amazon S3 for temporary media handling with immediate or time-limited deletion, blocked public access, and enforced server-side encryption
- Full audit logging of all data access and export events via Amazon CloudWatch
- Automated anomaly detection and incident response for suspicious access patterns

Although we use appropriate security measures and follow industry best practice, no form of data transmission over the internet can be guaranteed as completely secure. We ask you to act responsibly with your own account credentials and to contact us immediately if you believe your privacy has been breached.

## 11. Data retention

We retain personal data only for as long as necessary to fulfil the purposes described in this policy.

Retention periods:

- Raw audio files: deleted within 24 hours of processing
- Sampled visual frames: deleted immediately after feature extraction
- Derived features and Wellbeing Scores: retained for the duration of your active account
- Account data: deleted within 30 days of account closure, subject to any overriding legal obligations
- Aggregated, anonymised organisational data: may be retained for trend analysis, as this data cannot be linked to any individual

You may request deletion of your data at any time. You can also delete your account directly within the app, which triggers removal of all personal data.

## 12. Your rights

Under UK GDPR and applicable data protection law, you have the right to:

- **Access your personal data**: you can request confirmation of what data we hold and receive a copy
- **Correct inaccurate data**: if any information we hold about you is wrong or incomplete, you can ask us to update it
- **Delete your data**: you can ask us to erase your personal data, or delete your account directly in the app
- **Restrict processing**: you can ask us to limit how we use your data in certain circumstances
- **Object to processing**: you have the absolute right to object to processing for direct marketing purposes at any time
- **Data portability**: where technically feasible, you can request an electronic copy of the personal data you have provided to us
- **Withdraw consent**: you can withdraw consent at any time by discontinuing use of the app, deleting your account, or contacting us

You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data has been handled unlawfully.

To exercise any of these rights, contact us at dpo@mindmeasure.co.uk or write to us at the address in Section 1.

## 13. International data transfers

All personal data is stored and processed within UK and EU AWS regions. Where any sub-processor processes data outside the UK or EEA, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the UK government.

## 14. Age and eligibility

Mind Measure Pro is intended for users aged 18 and over. We do not knowingly collect personal data from anyone under 18.

The following safeguards apply:

- The employer is responsible for ensuring that users of the platform are eligible employees within their organisation
- No employer access to individual data is provided, regardless of the user's role or seniority
- Mind Measure does not use automated decision-making about individual users

If we learn that we have unknowingly collected personal data from someone under 18, we will delete that data as soon as possible.

## 15. Third-party services and sub-processors

Mind Measure uses a limited number of trusted third-party services to operate the platform. These include:

| Service | Provider | Purpose | Data handled |
|---|---|---|---|
| Identity management | Amazon Cognito | User authentication and account security | Email, authentication tokens |
| API routing | Amazon API Gateway | Secure request handling | API requests (no personal content) |
| Text analysis | AWS Bedrock (Claude) | Linguistic feature extraction from check-in text | Transcribed text |
| Transcription | ElevenLabs | Speech-to-text conversion during the live check-in | Audio (deleted within 24 hours) |
| Visual analysis | AWS Rekognition | Facial landmark and expression extraction | Sampled frames (deleted immediately) |
| Conversational interface | ElevenLabs | Voice prompts during check-ins | No personal data retained |
| Data storage | Aurora Serverless v2 | Encrypted structured data storage | All derived features and scores |
| Temporary media | Amazon S3 | Temporary buffer for audio and visual files | Audio and frames (deleted per retention policy) |
| Dashboard hosting | Vercel | Employer dashboard delivery | Aggregated, anonymised data only |
| Monitoring | Amazon CloudWatch | System logs and audit trails | Operational logs |

All sub-processors operate under GDPR-compliant terms. No sub-processor receives raw persistent media, and none has access to personally identifiable wellbeing data beyond what is strictly necessary for their function.

A full list of sub-processors is available on request to corporate partners.

## 16. Data Protection Impact Assessment

Given the nature of the data processed, including health-related data, audio and visual inputs, and automated analysis, Mind Measure has conducted a Data Protection Impact Assessment (DPIA) in accordance with UK GDPR requirements. This assessment covers the processing of wellbeing data, the multimodal assessment engine, media handling and deletion practices, and the aggregation framework used to generate organisational insight.

The DPIA is available on request to corporate partners as part of the procurement and due diligence process.

## 17. Changes to this policy

We may update this Privacy Policy from time to time. Material changes will be communicated through the Services or via appropriate notice. The "Last updated" date at the top of this page will be revised accordingly. You should refer to this policy regularly.

## 18. Contact us

If you have questions about this Privacy Policy or how your data is handled, please contact:

Mind Measure Ltd
Data Protection Officer
Email: dpo@mindmeasure.co.uk
Address: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
Website: mindmeasurepro.com

For all data protection queries across any Mind Measure document or service, contact dpo@mindmeasure.co.uk.
