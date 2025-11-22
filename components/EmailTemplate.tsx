import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Hr,
  Heading,
  Preview,
} from "@react-email/components";

interface EmailTemplateProps {
  subject: string;
  body: string;
}

export function EmailTemplate({ subject, body }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body
        style={{
          backgroundColor: "#f0f4f8",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "0 20px",
            maxWidth: "600px",
          }}
        >
          {/* Header Section */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px 12px 0 0",
              padding: "40px 40px 30px",
              borderBottom: "4px solid #3b82f6",
            }}
          >
            <Heading
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 16px",
                lineHeight: "1.3",
              }}
            >
              {subject || "New Message"}
            </Heading>
            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Section>

          {/* Body Section */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "30px 40px",
            }}
          >
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#374151",
                margin: "0",
                whiteSpace: "pre-wrap",
              }}
            >
              {body || "No content provided."}
            </Text>
          </Section>

          {/* Footer Section */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0 0 12px 12px",
              padding: "30px 40px 40px",
            }}
          >
            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e5e7eb",
                margin: "0 0 24px",
              }}
            />
            <Text
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                lineHeight: "1.6",
                margin: "0 0 8px",
              }}
            >
              This email was sent from your Mail App
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#d1d5db",
                lineHeight: "1.5",
                margin: "0",
              }}
            >
              © {new Date().getFullYear()} Apple macOS Clone. All rights reserved.
            </Text>
          </Section>

          {/* Bottom Spacing */}
          <Section
            style={{
              padding: "20px 0 0",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0",
              }}
            >
              Powered by Resend
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
