import Link from 'next/link'
import type { FooterLink } from '@/components/website/footerData'
import type { Path } from '@sanity/client/csm'
import { createDataAttribute } from 'next-sanity'

export type WebsiteFooterProps = {
  columns: [FooterLink[], FooterLink[], FooterLink[]]
  copyrightYear: number
  presentation?: { documentId: string; documentType: string; studioBaseUrl?: string }
}

function FooterAnchor({ label, href }: FooterLink) {
  const external = /^https?:\/\//i.test(href)
  const className = 'hover:text-white transition-colors duration-200'
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export function WebsiteFooter({ columns, copyrightYear, presentation }: WebsiteFooterProps) {
  const [col1, col2, col3] = columns
  const studioBaseUrl = presentation?.studioBaseUrl

  const presentationProps = (path: Path): Record<string, string> => {
    if (!presentation?.documentId || !presentation?.documentType || !studioBaseUrl) return {}
    const attr = createDataAttribute({
      id: presentation.documentId,
      type: presentation.documentType,
      baseUrl: studioBaseUrl,
      path,
    })
    return { 'data-sanity': attr.toString() }
  }

  return (
    <footer className="bg-[#141d19] py-12">
      <div className="container mx-auto px-6 md:px-10 lg:px-[100px] md:px-10 lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-3 flex flex-col items-start">
            <img src="/assets/footer/logo.svg" alt="Earn logo" className="" />
            <p className="text-[10px] text-[#7A7E70] font-normal font-inter text-right ml-16 mt-1">
              A member of the Earn Ecosystem
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8 font-mokoko text-[16px] font-medium text-[#7A7E70]">
            <div className="flex flex-col space-y-4">
              {col1.map((item, i) => {
                const external = /^https?:\/\//i.test(item.href)
                const className = 'hover:text-white transition-colors duration-200'
                return external ? (
                  <a
                    key={`footer-c1-${i}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    {...presentationProps(['column1', i])}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={`footer-c1-${i}`}
                    href={item.href}
                    className={className}
                    {...presentationProps(['column1', i])}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex flex-col space-y-4">
              {col2.map((item, i) => {
                const external = /^https?:\/\//i.test(item.href)
                const className = 'hover:text-white transition-colors duration-200'
                return external ? (
                  <a
                    key={`footer-c2-${i}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    {...presentationProps(['column2', i])}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={`footer-c2-${i}`}
                    href={item.href}
                    className={className}
                    {...presentationProps(['column2', i])}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex flex-col space-y-4">
              {col3.map((item, i) => {
                const external = /^https?:\/\//i.test(item.href)
                const className = 'hover:text-white transition-colors duration-200'
                return external ? (
                  <a
                    key={`footer-c3-${i}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    {...presentationProps(['column3', i])}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={`footer-c3-${i}`}
                    href={item.href}
                    className={className}
                    {...presentationProps(['column3', i])}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col lg:items-end">
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.linkedin.com/company/earndlt/"
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <img src="/assets/footer/linkedin-icon.svg" alt="Linkedin" />
              </a>
              <a href="https://x.com/earndlt/" className="" target="_blank" rel="noopener noreferrer">
                <img src="/assets/footer/x-icon.svg" alt="X" />
              </a>
            </div>
            <p className="text-sm text-[#7A7E70] font-normal font-inter">(+1) 877-905-EARN (3276)</p>
          </div>
        </div>
        <div className="border-t border-[#204734] my-8"></div>
        <div
          className="text-center text-[12px] text-[#606060] font-normal font-inter"
          {...presentationProps(['copyrightYear'])}
        >
          &copy; {copyrightYear} EarnDLT®. All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
