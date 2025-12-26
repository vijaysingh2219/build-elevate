import { Heading as ReactEmailHeading } from '@react-email/components';

interface EmailHeadingProps {
  children: string;
}

export const EmailHeading = ({ children }: EmailHeadingProps) => {
  return (
    <ReactEmailHeading className="mt-5 text-[28px] font-semibold leading-[34px] text-[#0f172a]">
      {children}
    </ReactEmailHeading>
  );
};
