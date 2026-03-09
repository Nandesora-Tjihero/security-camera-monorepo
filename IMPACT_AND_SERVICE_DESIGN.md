# Impact Measurement & Service Design

This document applies "Service Definition" principles to the Security Camera project, defining who the users are, how we measure success (KPIs), and the technical reliability targets (SLAs) required to deliver that value.

## 1. Roles & Personas

_Moving beyond generic "Users" to understand specific needs._

### Role: The Homeowner

**Persona: "Sarah, the Budget-Conscious Parent"**

- **Description**: Sarah has 2 kids and a drawer full of old laptops. She wants to keep an eye on her front door when she's at work but refuses to pay $300 for a Ring/Nest setup + monthly subscription.
- **Motivations**: Saving money, reusing waste, simplicity.
- **Pain Points**: "I am not technical. If it requires command line, I won't use it."
- **Impact on Design**: The Web App must have a "One-Click Setup" mode. Billing must offer a compelling "Free Tier".

### Role: The Privacy Advocate

**Persona: "David, the Tech-Savvy Skeptic"**

- **Description**: David works in IT. He trusts open-source software but distrusts big tech companies with video feeds inside his home.
- **Motivations**: Data sovereignty, local processing, end-to-end encryption.
- **Pain Points**: sending raw video streams to the cloud.
- **Impact on Design**: The "Local Object Detection" feature is critical for him. Only _events_ (snapshots) should be uploaded, not full streams.

---

## 2. Business Requirements & KPIs

_Measuring the "Business Value" defined in `BUSINESS_VALUE.html`._

| Objective                | Key Performance Indicator (KPI) | Target                | Rationale                                                                     |
| :----------------------- | :------------------------------ | :-------------------- | :---------------------------------------------------------------------------- |
| **Democratize Security** | **Active Device Reuse Rate**    | > 10,000 devices/year | Proves we are successfully diverting e-waste into security assets.            |
| **Trust & Reliability**  | **False Positive Ratio**        | < 5% of alerts        | If users get spam alerts (shadows/pets), they will disable notifications.     |
| **User Retention**       | **"Day-30" Retention**          | > 40%                 | Measures if users actually keep the system running effectively over time.     |
| **Cost Efficiency**      | **Cost Per Active User (CPAU)** | < $0.50 / month       | Essential for the "Free Tier" to be sustainable on Serverless infrastructure. |

---

## 3. Service Level Agreements (SLAs)

_Defining technical reliability using the Google SRE framework._

### Critical User Journey: The " Intruder Alert" Loop

**Context**: A person walks in front of the camera. The user relies on knowing this _immediately_.

#### SLA 1: Notification Latency

- **Definition**: The time duration from when the `image` is successfully uploaded to Storage -> to when the `FCM` notification request is acknowledged by the notification service.
- **SLA Target**: **95%** of notifications dispatched within **3 seconds**.
- **Consequence of Failure**: If alerts arrive 2 minutes late, the intruder is already gone. The service is useless.

#### SLA 2: Detection Availability

- **Definition**: The percentage of valid camera frames that successfully run through the TensorFlow.js model without crashing the browser tab.
- **SLA Target**: **99.5%** uptime per 24-hour active session.
- **Consequence of Failure**: If the browser tab crashes effectively "turning off" the camera, security is compromised.

---

## 4. Applying SMART Criteria

_Refining a generic requirement into a measurable one._

**Original Requirement**:
"The system should send notifications fast."

**Refined to SMART**:

- **Specific**: The Backend Function triggers on `object.finalized` and sends a message via Firebase Cloud Messaging.
- **Measurable**: Reported via Google Cloud Trace logs with specific timestamps.
- **Achievable**: Serverless guarantees ensure cold-starts are the only major latency factor (< 2s).
- **Relevant**: Speed is the core value proposition of a security camera.
- **Time-bound**: "Within 3 seconds" (as defined in the SLA).

**Final Requirement Text**:

> "The backend notification service must dispatch an alert to the user's mobile device within 3 seconds of receiving an event snapshot, for 95% of all events."
