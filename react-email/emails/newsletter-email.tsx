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
import { Extends } from "../../src/lib/utils";
import { Product } from "../../src/db/schema";

interface NewsletterEmailProps {
  email: string;
  baseUrl: string;
  products: Extends<Product, { storeName?: string }>[];
}

export const NewsletterEmail = ({
  email = "Guest",
  baseUrl = "http://localhost:3001",
  products = [
    {
      id: 69,
      name: "lofi girl",
      price: "69",
      slug: "lofi-girl",
      stock: 69,
      storeId: 100,
      rating: 0,
      storeName: "ok",
      category: "backpack",
      description: "Ok",
      image: JSON.stringify([
        {
          fileName: "Lofi_girl_logo.png",
          name: "Lofi_girl_logo.png",
          fileSize: 621783,
          size: 621783,
          fileKey: "726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          key: "726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          fileUrl:
            "https://utfs.io/f/726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          url: "https://utfs.io/f/726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
        },
        {
          fileName: "ab67706c0000da84e5c731700a747e480e4d11eb.png",
          name: "ab67706c0000da84e5c731700a747e480e4d11eb.png",
          fileSize: 732692,
          size: 732692,
          fileKey: "58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          key: "58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          fileUrl:
            "https://utfs.io/f/58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          url: "https://utfs.io/f/58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
        },
      ]),
      createdAt: null,
    },
    {
      id: 69,
      name: "lofi girl",
      price: "69",
      slug: "lofi-girl",
      stock: 69,
      storeId: 100,
      rating: 0,
      storeName: "ok",
      category: "backpack",
      description: "Ok",
      image: JSON.stringify([
        {
          fileName: "Lofi_girl_logo.png",
          name: "Lofi_girl_logo.png",
          fileSize: 621783,
          size: 621783,
          fileKey: "726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          key: "726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          fileUrl:
            "https://utfs.io/f/726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
          url: "https://utfs.io/f/726c4eef-935e-4a88-b054-e41767445c6f-cv6hnv.png",
        },
        {
          fileName: "ab67706c0000da84e5c731700a747e480e4d11eb.png",
          name: "ab67706c0000da84e5c731700a747e480e4d11eb.png",
          fileSize: 732692,
          size: 732692,
          fileKey: "58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          key: "58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          fileUrl:
            "https://utfs.io/f/58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
          url: "https://utfs.io/f/58c89340-ab81-4f84-9157-618fb726ec5d-h4wayq.png",
        },
      ]),
      createdAt: null,
    },
  ],
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
