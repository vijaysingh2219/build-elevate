import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { ChangeEmailProps } from '../types';

export const ChangeEmailTemplate = ({
  name,
  currentEmail,
  newEmail,
  verificationUrl,
}: ChangeEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email change request</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-[#f6f9fc] px-2 font-sans">
        <Container className="mx-auto my-10 mb-16 max-w-lg bg-white p-5 pb-12">
          <Heading className="mx-0 my-10 p-0 text-center text-2xl font-bold text-[#333]">
            Email Change Request
          </Heading>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">Hi {name},</Text>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            We received a request to change your email address from <strong>{currentEmail}</strong>{' '}
            to <strong>{newEmail}</strong>.
          </Text>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            To confirm this change, please click the button below. This link will expire in 24
            hours.
          </Text>
          <Section className="px-6 py-7 text-center">
            <Button
              className="block rounded-lg bg-black px-6 py-3 text-center text-base font-bold text-white no-underline"
              href={verificationUrl}
            >
              Verify Email Change
            </Button>
          </Section>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            Or copy and paste this URL into your browser:
            <br />
            <Link href={verificationUrl} className="break-all text-sm text-black underline">
              {verificationUrl}
            </Link>
          </Text>
          <Hr className="mx-6 my-5 border-[#e6ebf1]" />
          <Text className="mx-6 my-4 text-sm leading-relaxed text-[#8898aa]">
            If you didn&apos;t request this change, please ignore this email or contact support if
            you&apos;re concerned about your account security.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ChangeEmailTemplate.PreviewProps = {
  name: 'Example User',
  currentEmail: 'current@example.com',
  newEmail: 'new@example.com',
  verificationUrl: 'https://example.com/verify?token=abc123',
} as ChangeEmailProps;

export default ChangeEmailTemplate;
