import { Heading as ReactEmailHeading } from '@react-email/components';

interface EmailHeadingProps {
  children: string;
}

export const EmailHeading = ({ children }: EmailHeadingProps) => {
  return (
    <ReactEmailHeading className="mt-5 text-[28px] leading-[34px] font-semibold text-[#0f172a]">
      {children}
    </ReactEmailHeading>
  );
};
