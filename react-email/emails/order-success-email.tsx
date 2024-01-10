import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { UploadData } from "@/types";
import type { Product } from "@/db/schema";
import { type Extends } from "@/lib/utils";
import { beautifyId } from "../utils/beautify-id";
import { formatCurrency } from "../utils/format-currency";
import { calculateTotalPrice } from "../utils/calculate-total-price";

interface OrderSuccessEmailProps {
  orderId: string;
  userEmail: string;
  orderItems: Extends<Product, { qty: number }>[];
}

export const OrderSuccessEmail = ({
  userEmail = "Guest",
  orderItems = [
    {
      id: 6,
      storeId: 5,
      name: "kucing",
      slug: "kucing",
      description: "asdsdsadad",
      price: "22.00",
      stock: 33,
      rating: 0,
      category: "clothing",
      image:
        '[{"fileName":"kucing_guangdong.jpeg","name":"kucing_guangdong.jpeg","fileSize":78118,"size":78118,"fileKey":"8903f484-57c2-4510-8496-133f07c6f387-mn3oxm.jpeg","key":"8903f484-57c2-4510-8496-133f07c6f387-mn3oxm.jpeg","fileUrl":"https://utfs.io/f/8903f484-57c2-4510-8496-133f07c6f387-mn3oxm.jpeg","url":"https://utfs.io/f/8903f484-57c2-4510-8496-133f07c6f387-mn3oxm.jpeg"}]',
      createdAt: new Date(),
      qty: 1,
    },
  ],
  orderId = "pi_3OWcz9AaT0py2Y5O2URORKej",
}: OrderSuccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Text>Hello, {userEmail}!</Text>
            <Heading className="text-black text-[24px] font-semibold p-0 my-[10px] mx-0">
              Thank you for your order!
            </Heading>
            <Text>
              Order ID:{" "}
              <span className="font-medium">
                {orderId ? beautifyId(orderId) : ""}
              </span>
            </Text>
            <Text>Here is your order items:</Text>
            <Section className="flex flex-col gap-4">
              {!!orderItems.length &&
                orderItems.map((orderItem) => {
                  const parsedImageUrl = (
                    JSON.parse(orderItem?.image as string) as UploadData[]
                  )[0]?.url;

                  return (
                    <Row
                      className="inline-flex justify-between my-2"
                      key={orderItem.id}
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
                            <span className="text-sm">{orderItem.name}</span>
                          </Row>
                          <Row>
                            <span className="text-sm">
                              {`${orderItem.qty} x ${formatCurrency(
                                Number(orderItem.price),
                              )}`}
                            </span>
                          </Row>
                        </Container>
                      </Column>
                    </Row>
                  );
                })}
            </Section>
            <Hr />
            <Section className="text-sm">
              <Row className="my-2">
                <Column align="left">Total Order</Column>
                <Column className="font-medium" align="right">
                  {formatCurrency(calculateTotalPrice(orderItems))}
                </Column>
              </Row>
              <Row className="my-2">
                <Column align="left">Shipping Fee</Column>
                <Column className="font-medium" align="right">
                  FREE
                </Column>
              </Row>
            </Section>
            <Hr />
            <Section>
              <Text>
                Thank you for shopping with us! Our team is working on your
                order and will deliver it directly to your door.
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

export default OrderSuccessEmail;
