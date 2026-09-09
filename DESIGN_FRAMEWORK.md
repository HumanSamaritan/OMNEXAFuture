# OMNeXa Website Design Framework

This framework governs future OMNeXa website and product-page design changes so layout, typography, colour and responsive behaviour stay coherent as the portfolio expands.

## 1. No-overlap rule

Text must never collide with an adjacent visual, card, button or navigation element.

- Every grid/flex child that contains text must allow shrinking with `min-width: 0`.
- Product and brand names must use responsive `clamp()` sizing rather than inheriting the site-wide hero size.
- Long unbroken names must be tested explicitly; headings should not use `white-space: nowrap`.
- Layouts must stack **before** the available text column becomes unsafe. Do not wait until overlap appears.
- No horizontal clipping or hidden text is acceptable as a layout solution.
- **Do not remove a strong product visual merely to solve a text collision.** First reduce the heading scale, introduce a deliberate line break where appropriate, rebalance the grid, or stack the layout earlier.

## 2. Responsive QA breakpoints

Every substantial page change should be visually checked at approximately:

- 360–390 px mobile
- 768 px tablet
- 1024 px compact desktop/tablet landscape
- 1280 px laptop
- 1440 px desktop
- 1920 px wide desktop

Checks must include long product names, multi-line headings, buttons, breadcrumbs, navigation, capability lists and footer content.

## 3. Typography hierarchy

OMNeXa typography should feel calm, premium and readable rather than oversized or overly heavy.

- Product-detail H1: maximum around 4rem; responsive via `clamp()`.
- Long product names may use a smaller maximum size or a deliberate two-line treatment.
- H1/H2 weight: generally 750–800, not ultra-black unless a specific campaign treatment requires it.
- Body copy: comfortable line height of roughly 1.55–1.75.
- Eyebrows and labels: restrained size and letter-spacing; use them for hierarchy, not decoration.
- Avoid excessive all-caps copy.
- Avoid multiple competing large-text statements in the same viewport.

## 4. Box discipline

OMNeXa should avoid “box soup”. A box is used only when containment adds meaning.

Default preference:

- open editorial layout
- whitespace
- thin rules
- subtle dividers
- one restrained accent

Use cards when the item is genuinely independent, interactive or comparable. Do not put every paragraph, capability, FAQ and visual inside a rounded container.

**Product concept visuals are an intentional exception:** one strong, premium visual panel in the product hero is allowed when it communicates the product idea, hook or interaction model. It should not be removed simply to make the adjacent title fit.

## 5. Colour discipline

Colour communicates meaning, not decoration.

- Neutral base: warm off-white, charcoal/ink and muted grey.
- Use one restrained accent per context or service category.
- Avoid cycling colours merely because items have different sequence numbers.
- Do not place low-contrast gold/yellow copy on beige backgrounds.
- Gradients should be rare and purposeful.
- Dark product concept visuals must maintain strong text contrast; primary statement text should remain near-white rather than inheriting a dark category colour.
- Body text and important labels should maintain WCAG AA-level readable contrast where practical.

## 6. Product-detail pattern

Product pages should follow a stable pattern:

1. Breadcrumb
2. Service category
3. Product name and one-line definition
4. Development status and work-in-progress link
5. Strong concept visual / product hook
6. Problem and direction
7. Capabilities shown as an open numbered list, not boxed tiles
8. Service-category rationale
9. Intended audiences
10. Related products
11. AEO/FAQ context

The visual hierarchy must remain readable even if a product name is substantially longer than current examples.

## 7. Content and design integrity

- “Currently under construction” must remain visible for work-in-progress products.
- Development intentions must not be presented as validated outcomes.
- UI styling must not imply clinical, regulatory or performance validation that has not occurred.
- SEO/AEO copy must remain readable to humans; do not distort visible design for keyword stuffing.

## 8. Pre-merge visual QA checklist

Before a design branch is promoted:

- [ ] No overlap at target viewport sizes
- [ ] No clipped headings or buttons
- [ ] No unexpected horizontal scrolling
- [ ] Longest product name tested
- [ ] Mobile stacking occurs before compression becomes uncomfortable
- [ ] Heading sizes remain subordinate to available width
- [ ] Product hero concept visual preserved unless there is a content/design reason to remove it
- [ ] No unnecessary boxes or nested cards
- [ ] Colour palette is restrained and category-consistent
- [ ] Text/background contrast is readable
- [ ] Status labels remain visible
- [ ] Links remain obvious without excessive decoration
- [ ] SEO/AEO semantic structure remains intact
- [ ] Preview deployment checked before production promotion
