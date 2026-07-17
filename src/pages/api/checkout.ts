import type { APIRoute } from "astro";
import Stripe from "stripe";
import {
  getCommerceOption,
  getCommerceOptionMaterialLine,
  getCommerceOptionProofLine,
  getCommerceOptionTypeLabel,
  getCommerceProduct,
} from "../../data/commerce/catalog";

export const prerender = false;

const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
const siteUrl = import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321";

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey);

type CheckoutBody = {
  workSlug: string;
  optionLabel: string;
};

function toCents(priceEUR: number): number {
  if (!Number.isFinite(priceEUR) || priceEUR <= 0) {
    throw new Error(`Invalid priceEUR: ${priceEUR}`);
  }

  return Math.round(priceEUR * 100);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { workSlug, optionLabel } = body;

    if (!workSlug || !optionLabel) {
      return new Response(
        JSON.stringify({ error: "Missing required checkout fields." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const product = getCommerceProduct(workSlug);

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Unknown artwork." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const selectedOption = getCommerceOption(workSlug, optionLabel);

    if (!selectedOption) {
      return new Response(
        JSON.stringify({ error: "Unknown format." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const amount = toCents(selectedOption.priceEUR);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/works/${workSlug}?checkout=success`,
      cancel_url: `${siteUrl}/works/${workSlug}?checkout=cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: `${product.workTitle} — ${selectedOption.label}`,
              description: `${selectedOption.dimensions} · ${getCommerceOptionTypeLabel(selectedOption)} · Rostyslav Brenych`,
              ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
              metadata: {
                workSlug,
                optionLabel: selectedOption.label,
                optionSizeKey: selectedOption.sizeKey,
                editionType: selectedOption.type,
              },
            },
          },
        },
      ],
      metadata: {
        workSlug,
        workTitle: product.workTitle,
        optionLabel: selectedOption.label,
        optionSizeKey: selectedOption.sizeKey,
        dimensions: selectedOption.dimensions,
        priceEUR: String(selectedOption.priceEUR),
        editionType: selectedOption.type,
        editionTypeLabel: getCommerceOptionTypeLabel(selectedOption),
        editionSize: selectedOption.editionSize
          ? String(selectedOption.editionSize)
          : "",
        proofLine: getCommerceOptionProofLine(selectedOption),
        materialLine: getCommerceOptionMaterialLine(selectedOption),
        signed: selectedOption.signed ? "true" : "false",
        certificateIncluded: selectedOption.certificateIncluded ? "true" : "false",
        paper: selectedOption.paper ?? "",
        printMethod: selectedOption.printMethod ?? "",
        productionTime: selectedOption.productionTime ?? "",
      },
      allow_promotion_codes: false,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "ES",
          "PT",
          "FR",
          "DE",
          "IT",
          "NL",
          "BE",
          "AT",
          "IE",
          "DK",
          "SE",
          "FI",
          "PL",
          "CZ",
          "US",
          "GB",
          "CH",
        ],
      },
    });

    return new Response(
      JSON.stringify({
        url: session.url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return new Response(
      JSON.stringify({
        error: "Unable to create checkout session.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
