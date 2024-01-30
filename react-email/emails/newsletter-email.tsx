import {
  Body,
  Html,
  Head,
  Tailwind,
  Container,
  Text,
  Heading,
  Column,
  Row,
  Img,
  Section,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";
import { UploadData } from "@/types";
import { Product } from "../../src/db/schema";

interface NewsletterEmailProps {
  email: string;
  baseUrl: string;
  products: Product[];
}

export const NewsletterEmail = ({
  email = "Guest",
  baseUrl,
  products,
}: NewsletterEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Text>Hello, {email}!</Text>
            <Heading className="text-black text-[24px] font-semibold p-0 my-[10px] mx-0">
              New Arrival Products!
            </Heading>
            <Text>
              As a valued member of the commerce, you get the first look at
              these exciting new offerings. Dive in and be the first to grab
              these latest products from our amazing sellers.
            </Text>
            <Hr />
            <Section className="flex flex-col gap-4">
              {!!products.length &&
                products.map((product) => {
                  const parsedImageUrl = (
                    JSON.parse(product?.image as string) as UploadData[]
                  )[0]?.url;

                  return (
                    <Row
                      className="inline-flex justify-between my-2"
                      key={product.id}
                    >
                      <Column align="left">
                        <Img
                          className="rounded"
                          src={parsedImageUrl}
                          width="64"
                          height="64"
                        />
                      </Column>
                      <Column align="center">
                        <Container className="ml-4">
                          <Row>
                            <span className="text-sm font-medium">
                              {product.name}
                            </span>
                          </Row>
                          <Row>
                            <Link
                              href={`${baseUrl}/product/${product.slug}`}
                              target="_blank"
                            >
                              <span className="text-sm">
                                Browse Product &gt;
                              </span>
                            </Link>
                          </Row>
                        </Container>
                      </Column>
                    </Row>
                  );
                })}
            </Section>
            <Hr />
            <Section>
              <Text>
                Thank your for choosing us as your marketplace platform. Do not
                hesitate to spend all your lifetime saving with us. More money
                equals more happiness!
              </Text>
              <Text>Cheers!</Text>
              <Row>
                <span className="text-sm">CEO of Commerce</span>
              </Row>
              <Row>
                <span className="text-sm font-medium">Hendri William</span>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewsletterEmail;
