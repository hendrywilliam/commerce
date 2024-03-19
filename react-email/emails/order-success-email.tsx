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
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { UploadData } from "../../src/types";
import { beautifyId } from "../utils/beautify-id";
import { type Extends } from "../../src/lib/utils";
import type { Product } from "../../src/db/schema";
import { formatCurrency } from "../utils/format-currency";
import { calculateTotalPrice } from "../utils/calculate-total-price";

interface OrderSuccessEmailProps {
  orderId: string;
  email: string;
  orderItems: Extends<Product, { qty: number }>[];
}

export const OrderSuccessEmail = ({
  email = "Guest",
  orderItems,
  orderId,
}: OrderSuccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text>Hello, {email}!</Text>
            <Heading className="mx-0 my-[10px] p-0 text-[24px] font-semibold text-black">
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
              {orderItems.length > 0 &&
                orderItems.map((orderItem) => {
                  return (
                    <Row
                      className="my-2 inline-flex justify-between"
                      key={orderItem.id}
                    >
                      <Column align="left">
                        <Img
                          className="rounded"
                          src={orderItem.image[0].url}
                          width="64"
                          height="64"
                        />
                      </Column>
                      <Column align="center">
                        <Container className="ml-4">
                          <Row>
                            <span className="text-sm font-medium">
                              {orderItem.name}
                            </span>
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
