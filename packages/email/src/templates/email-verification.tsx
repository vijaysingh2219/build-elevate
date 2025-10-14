import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import { VerificationEmailProps } from '../types';

export const VerificationEmail = ({ name, verificationUrl }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify Your Email Address 🎉</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-lg rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Verify Your Email Address
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hello {name},</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you for signing up! To complete your registration, please verify your email
              address by clicking the button below.
            </Text>
            <Button
              href={verificationUrl}
              className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
            >
              Verify Email
            </Button>
            <Text className="mt-4 text-[14px] leading-[24px] text-black">
              If the button doesn't work, copy and paste this link into your browser:{' '}
              {verificationUrl}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was intended for <span className="text-black">{name}</span>. If you did not
              sign up, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerificationEmail.PreviewProps = {
  name: 'Example User',
  verificationUrl: 'https://example.com/verify?token=abc123',
} as VerificationEmailProps;

export default VerificationEmail;
