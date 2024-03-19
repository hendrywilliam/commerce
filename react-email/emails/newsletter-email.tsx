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
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text>Hello, {email}!</Text>
            <Heading className="mx-0 my-[10px] p-0 text-[24px] font-semibold text-black">
              New Arrival Products!
            </Heading>
            <Text>
              As a valued member of the commerce, you get the first look at
              these exciting new offerings. Dive in and be the first to grab
              these latest products from our amazing sellers.
            </Text>
            <Hr />
            <Section className="flex flex-col gap-4">
              {products.length > 0 &&
                products.map((product) => {
                  return (
                    <Row
                      className="my-2 inline-flex justify-between"
                      key={product.id}
                    >
                      <Column align="left">
                        <Img
                          className="rounded"
                          src={product.image[0].url}
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
