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
import { ResetPasswordProps } from '../types';

export const ResetPasswordTemplate = ({ name, resetUrl }: ResetPasswordProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-[#f6f9fc] px-2 font-sans">
        <Container className="mx-auto my-10 mb-16 max-w-lg bg-white p-5 pb-12">
          <Heading className="mx-0 my-10 p-0 text-center text-2xl font-bold text-[#333]">
            Reset Your Password
          </Heading>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">Hi {name},</Text>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            We received a request to reset your password for your account. If you didn&apos;t make
            this request, you can safely ignore this email.
          </Text>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            To reset your password, click the button below. This link will expire in 1 hour for
            security reasons.
          </Text>
          <Section className="px-6 py-7 text-center">
            <Button
              className="block rounded-lg bg-black px-6 py-3 text-center text-base font-bold text-white no-underline"
              href={resetUrl}
            >
              Reset Password
            </Button>
          </Section>
          <Text className="mx-6 my-4 text-base leading-relaxed text-[#333]">
            Or copy and paste this URL into your browser:
            <br />
            <Link href={resetUrl} className="break-all text-sm text-black underline">
              {resetUrl}
            </Link>
          </Text>
          <Hr className="mx-6 my-5 border-[#e6ebf1]" />
          <Text className="mx-6 my-4 text-sm leading-relaxed text-[#8898aa]">
            If you didn&apos;t request a password reset, please ignore this email or contact support
            if you&apos;re concerned about your account security.
          </Text>
          <Text className="mx-6 my-4 text-sm leading-relaxed text-[#8898aa]">
            For security reasons, this link will expire in 1 hour.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ResetPasswordTemplate.PreviewProps = {
  name: 'Example User',
  resetUrl: 'https://example.com/reset-password?token=abc123',
} as ResetPasswordProps;

export default ResetPasswordTemplate;
