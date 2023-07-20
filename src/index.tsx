import { html } from "@elysiajs/html";
import { clsx } from "clsx";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import { db, getLatestProducts } from "./db";
import { Product, productsSchema } from "./db/schema";
import { priceFormat } from "./price-format";
import invariant from "tiny-invariant";

type ProductListOwnProps = {
  products: Product[];
  className?: string;
};

function ProductList(props: ProductListOwnProps) {
  return (
    <div id="product-list">
      <h2 class="text-xl font-semibold text-gray-700">
        Latest {props.products.length} products
      </h2>

      <ul class={clsx("mt-4 text-lg text-gray-500", props.className)}>
        {props.products.length === 0 ? (
          <li class="italic">No products yet</li>
        ) : (
          props.products.map((product) => (
            <li>
              {product.name} {priceFormat.format(Number(product.price))}
              {/* <form action="/api/delete-product" method="POST">
                <input type="hidden" name="id" value={product.id} />
                <button type="submit">Delete</button>
              </form> */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function NewProductForm() {
  return (
    <form
      id="new-product-form"
      hx-post="/api/new-product"
      hx-trigger="submit"
      hx-swap="outerHTML"
      hx-target="#product-list"
      hx-indicator="#new-product-indicator"
      class="grid gap-y-6 grid-cols-1 group"
      x-data="{ name: null, price: null, submitting: false, error: null }"
      onsubmit="this.reset()"
    >
      <label class="grid gap-1">
        <div>Name</div>
        <div class="relative">
          <input
            type="text"
            name="name"
            required=""
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Product name"
            pattern=".{3,}"
            x-model="name"
          />
        </div>
      </label>

      <label class="grid gap-1">
        <div>Price</div>
        <div class="relative">
          <input
            type="number"
            name="price"
            required=""
            class="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            step="0.01"
            min="0.01"
            pattern="^\d+(?:\.\d{1,2})?$"
            placeholder="420.69"
            x-model="price"
          />
          <span class="pointer-events-none absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
            $
          </span>
        </div>
      </label>

      <button
        type="submit"
        class="flex gap-x-3 items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        x-bind:disabled="!name || !price || submitting"
      >
        <span>Add product</span>

        <div
          id="new-product-indicator"
          class="hidden htmx-request:block"
          role="status"
        >
          {/* @ts-expect-error */}
          <svg
            aria-hidden="true"
            class="w-5 h-5 mr-2 animate-spin fill-blue-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* @ts-expect-error */}
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            {/* @ts-expect-error */}
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
            {/* @ts-expect-error */}
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </button>

      <div class="text-red-500" x-show="error">
        <span x-text="error"></span>
      </div>
    </form>
  );
}

function BuiltWith() {
  return (
    <div>
      <h2 class="text-lg text-gray-500 font-medium">Built with</h2>

      <ul class="list-disc pl-4 space-y-1 mt-4 list-outside text-gray-500">
        <li>
          {/* <!-- Astro --> */}
          <a href="https://astro.build/">https://astro.build/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to hold everything together.
          </p>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Bonus: Lets me deploy anywhere 🚀
          </p>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Current: ▲ Vercel
          </p>
        </li>
        <li>
          {/* <!-- SolidJS --> */}
          <a href="https://solidjs.com/">https://solidjs.com/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to render the product list in SSR and render it in the response
            from /api/new-product.
          </p>
        </li>
        <li>
          {/* <!-- HTMX --> */}
          <a href="https://htmx.org/">https://htmx.org/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to handle the form submission HTTP. ⚡️
          </p>
        </li>
        <li>
          {/* <!-- AlpineJS --> */}
          <a href="https://alpinejs.dev/">https://alpinejs.dev/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to handle the form submission validation. 🔮✨
          </p>
        </li>
        <li>
          {/* <!-- TailwindCSS --> */}
          <a href="https://tailwindcss.com/">https://tailwindcss.com/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to style the page.
          </p>
        </li>
        <li>
          {/* <!-- PlanetScale --> */}
          <a href="https://planetscale.com/">https://planetscale.com/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            MySQL compatible Edge™ DBaaS. Used to store the products.
          </p>
        </li>
        <li>
          {/* <!-- Drizzle ORM/Kit --> */}
          <a href="https://drizzle.team/">https://drizzle.team/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            "Professional developers" creating an ORM as well as a DBMS Kit. Yet
            TBD. whether it's a good idea to use it in production. 🤷‍♂️
          </p>
        </li>
        <li>
          {/* <!-- Resend --> */}
          <a href="https://resend.com/">https://resend.com/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            I receive an email when a new product has been added. Keeping an eye
            on you 👀
          </p>
        </li>
        <li>
          {/* <!-- React Email --> */}
          <a href="https://react.email/">https://react.email/</a>
          <p class="text-gray-500 max-w-xs text-xs font-light">
            Used to create the email template being sent to me
          </p>
        </li>
      </ul>
    </div>
  );
}

function Layout(props: elements.Children) {
  return `<html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <title>Astro HTMX</title>

        <script
          src="https://unpkg.com/htmx.org@1.9.2"
          integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h"
          crossorigin="anonymous"
        ></script>

        <script src="//unpkg.com/alpinejs" defer=""></script>
      </head>

      ${props.children}
    </html>`;
}

new Elysia()
  .use(html())
  .get("/", async ({ html }) => {
    const products = await getLatestProducts();

    return html(
      <Layout>
        <body class="min-h-screen grid place-items-center bg-gray-50">
          <div class="space-y-8">
            <div>
              <h1 class="text-2xl font-bold">Astro HTMX</h1>

              <a
                href="https://github.com/CasperEngl/astro-htmx/"
                rel="noopener noreferrer"
                target="_blank"
                class="mt-2 block text-blue-500 hover:text-blue-600 underline visited:text-purple-500"
              >
                https://github.com/CasperEngl/astro-htmx/
              </a>
            </div>

            <div class="grid lg:grid-cols-2 items-start gap-x-12 gap-y-16">
              <ProductList products={products} />

              <NewProductForm />
            </div>

            <BuiltWith />
          </div>
        </body>
      </Layout>,
    );
  })
  .post(
    "/api/new-product",
    async ({ html, params }) => {
      invariant(params.name, "Missing name");
      invariant(params.price, "Missing price");

      await db
        .insert(productsSchema)
        .values({
          name: params.name,
          price: params.price,
        })
        .run();

      const products = await getLatestProducts();

      html(<ProductList products={products} />);
    },
    {
      params: t.Object({
        name: t.String(),
        price: t.Number(),
      }),
    },
  )
  .listen(3000);
