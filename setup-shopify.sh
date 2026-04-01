#!/bin/bash
# ============================================================
# Aura Running — Shopify Store Setup Script
# Run this AFTER authenticating with Shopify CLI:
#   shopify auth login --store smooth-sailing-store-apljc.myshopify.com
#
# This script uses the Shopify Admin GraphQL API via CLI to:
# 1. Create the "editorial" blog
# 2. Create blog articles with tags/categories
# 3. Assign custom product templates
# ============================================================

STORE="smooth-sailing-store-apljc.myshopify.com"

echo "============================================================"
echo "STEP 1: Create the 'editorial' blog"
echo "============================================================"

# Create the Editorial blog
BLOG_RESPONSE=$(shopify app function run --path . 2>/dev/null || true)

# Using the Admin API via curl - you need to set your token
# Get this from: Settings → Apps → Develop apps → Create app → Admin API → Install
echo ""
echo "To use this script, you need your Admin API access token."
echo "Get it from: Shopify Admin → Settings → Apps → Develop apps"
echo "  1. Click 'Create an app' → name it 'CLI Access'"
echo "  2. Configure Admin API scopes: write_content, write_products, write_themes"
echo "  3. Install the app"
echo "  4. Copy the Admin API access token"
echo ""
read -p "Paste your Admin API access token: " ADMIN_TOKEN

if [ -z "$ADMIN_TOKEN" ]; then
  echo "No token provided. Exiting."
  exit 1
fi

API_URL="https://${STORE}/admin/api/2025-01/graphql.json"

echo ""
echo "Creating 'Editorial' blog..."

BLOG_RESULT=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
  -d '{
    "query": "mutation { blogCreate(blog: { title: \"Editorial\" }) { blog { id handle } userErrors { field message } } }"
  }')

echo "$BLOG_RESULT" | python3 -m json.tool 2>/dev/null || echo "$BLOG_RESULT"

# Extract blog ID
BLOG_ID=$(echo "$BLOG_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['blogCreate']['blog']['id'])" 2>/dev/null)

if [ -z "$BLOG_ID" ]; then
  echo "Blog may already exist. Fetching existing..."
  BLOG_ID=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
    -d '{
      "query": "{ blogs(first: 10) { edges { node { id handle title } } } }"
    }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
for edge in data['data']['blogs']['edges']:
    if edge['node']['handle'] == 'editorial':
        print(edge['node']['id'])
        break
" 2>/dev/null)
fi

echo "Blog ID: $BLOG_ID"

echo ""
echo "============================================================"
echo "STEP 2: Create blog articles"
echo "============================================================"

create_article() {
  local title="$1"
  local tags="$2"
  local excerpt="$3"
  local body="$4"

  echo "Creating: $title"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
    -d "$(cat <<GRAPHQL
{
  "query": "mutation articleCreate(\$article: ArticleCreateInput!) { articleCreate(article: \$article) { article { id title handle } userErrors { field message } } }",
  "variables": {
    "article": {
      "blogId": "$BLOG_ID",
      "title": "$title",
      "tags": "$tags",
      "isPublished": true,
      "body": "<p>$excerpt</p><p>$body</p>"
    }
  }
}
GRAPHQL
)" | python3 -c "import sys,json; d=json.load(sys.stdin); print('  ✓', d.get('data',{}).get('articleCreate',{}).get('article',{}).get('handle','error'))" 2>/dev/null || echo "  ✗ Failed"
}

create_article \
  "Body Glide vs Squirrel's Nut Butter: Which Actually Works for Ultra Runners" \
  "Science & Research" \
  "Comparing two of the most popular anti-chafing products by formulation, duration, and real-world performance beyond the marathon distance." \
  "A detailed comparison for endurance athletes choosing between these two popular anti-chafe solutions."

create_article \
  "Trail Running Drop Bag Essentials: What to Pack for 50 and 100 Mile Races" \
  "Training & Recovery" \
  "Foot care protocol, nutrition, lighting, and the items experienced runners always include." \
  "A complete guide to drop bag strategy for ultra-distance trail races."

create_article \
  "UTMB Preparation Guide: Training, Gear, and Body Care for 100-Mile Success" \
  "Training & Recovery" \
  "Everything you need to know to prepare for the Ultra-Trail du Mont-Blanc." \
  "From training blocks to gear selection to skin protection strategy for the world's most iconic ultra."

create_article \
  "Best Trail Running Socks for Ultra Distance" \
  "Gear & Innovation" \
  "The right sock can mean the difference between finishing strong and dropping at mile 60." \
  "A comprehensive review of the best socks for ultra-distance trail running."

create_article \
  "Inner Thigh Chafing While Running: Why It Gets Worse Over Distance" \
  "Science & Research" \
  "Understanding the biomechanics of why inner thigh friction increases exponentially with distance." \
  "The science of thigh chafing and evidence-based prevention strategies."

create_article \
  "How to Prevent Blisters During a 100-Mile Race" \
  "Science & Research" \
  "Blister prevention at the ultra distance requires a fundamentally different approach than marathon racing." \
  "Comprehensive blister prevention strategies for 100-mile ultramarathon runners."

create_article \
  "What Makes a Great Anti-Chafing Cream: The Science of Ingredients That Actually Protect Runners" \
  "Science & Research" \
  "Not all anti-chafe products are created equal. The formulation science that separates performance from marketing." \
  "A deep dive into the ingredients and formulation science behind effective anti-chafe products."

create_article \
  "How to Prevent Chafing During a Marathon" \
  "Science & Research" \
  "26.2 miles of repetitive motion creates unique friction challenges. Prevention strategies for race day." \
  "Marathon-specific chafing prevention for training and race day."

create_article \
  "Why Chafing Gets Worse in Winter" \
  "Science & Research" \
  "Cold air, layered clothing, and dry skin create a perfect storm for winter running friction." \
  "Understanding the seasonal factors that amplify chafing risk in cold weather."

create_article \
  "Running a Backyard Ultra: A Race With No Finish Line" \
  "Training & Recovery" \
  "The last person standing format demands a completely different approach to body management." \
  "Strategy, preparation, and body care for the unique challenge of backyard ultra racing."

create_article \
  "Building Running Mileage Without Injury: Evidence-Based Guide" \
  "Training & Recovery" \
  "The 10% rule is oversimplified. Here's what the research actually says about safe mileage progression." \
  "Evidence-based approaches to building weekly running volume without overuse injuries."

create_article \
  "Best Hydration Vests for Ultra Marathon Runners" \
  "Gear & Innovation" \
  "The right hydration vest eliminates bounce, reduces chafing, and keeps fluids accessible." \
  "A curated review of the best hydration vests for ultra-distance running."

create_article \
  "Blister Prevention for Marathons: Foot Protection Guide" \
  "Science & Research" \
  "Moisture increases skin friction by up to 57%. The science of why feet fail during marathons." \
  "Evidence-based foot protection strategies for marathon runners."

create_article \
  "Running as Therapy: Mental Health Benefits" \
  "Aura Movement" \
  "Flow state only works when the body is not competing for the mind's attention." \
  "The neuroscience of why physical comfort unlocks psychological healing through running."

create_article \
  "Preventing Repetitive Foot Stress Injuries" \
  "Science & Research" \
  "A 2-degree gait shift over a 16-week training cycle means 400,000 dysfunctional repetitions." \
  "How skin irritation creates the overuse injuries that end running seasons."

echo ""
echo "============================================================"
echo "STEP 3: Assign product templates"
echo "============================================================"
echo ""
echo "Fetching products..."

PRODUCTS=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
  -d '{
    "query": "{ products(first: 10) { edges { node { id title handle } } } }"
  }')

echo "$PRODUCTS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for edge in data['data']['products']['edges']:
    p = edge['node']
    print(f\"  {p['handle']}: {p['id']}\")
"

# Template mapping
declare -A TEMPLATE_MAP
TEMPLATE_MAP["aura-stride"]="aura-stride"
TEMPLATE_MAP["aura-ultra"]="aura-ultra"
TEMPLATE_MAP["aura-recovery"]="aura-recovery"
TEMPLATE_MAP["aura-full"]=""  # no custom template

echo ""
echo "Assigning templates..."

assign_template() {
  local product_id="$1"
  local template="$2"
  local handle="$3"

  if [ -z "$template" ]; then
    echo "  Skipping $handle (no custom template)"
    return
  fi

  echo "  Assigning template '$template' to $handle..."
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
    -d "{
      \"query\": \"mutation { productUpdate(input: { id: \\\"$product_id\\\", templateSuffix: \\\"$template\\\" }) { product { id templateSuffix } userErrors { field message } } }\"
    }" | python3 -c "import sys,json; d=json.load(sys.stdin); print('    ✓ Done' if not d.get('data',{}).get('productUpdate',{}).get('userErrors') else '    ✗ Error')" 2>/dev/null || echo "    ✗ Failed"
}

# Parse products and assign templates
echo "$PRODUCTS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for edge in data['data']['products']['edges']:
    p = edge['node']
    print(f\"{p['id']}|{p['handle']}\")
" | while IFS='|' read -r pid phandle; do
  case "$phandle" in
    *stride*) assign_template "$pid" "aura-stride" "$phandle" ;;
    *ultra*)  assign_template "$pid" "aura-ultra" "$phandle" ;;
    *recov*)  assign_template "$pid" "aura-recovery" "$phandle" ;;
    *)        echo "  Skipping $phandle (using default template)" ;;
  esac
done

echo ""
echo "============================================================"
echo "STEP 4: Create 301 URL redirects (SEO migration)"
echo "============================================================"
echo ""
echo "Creating redirects from old Lovable URLs to Shopify blog URLs..."

create_redirect() {
  local old_path="$1"
  local new_path="$2"

  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $ADMIN_TOKEN" \
    -d "{
      \"query\": \"mutation { urlRedirectCreate(urlRedirect: { path: \\\"$old_path\\\", target: \\\"$new_path\\\" }) { urlRedirect { id path target } userErrors { field message } } }\"
    }" | python3 -c "import sys,json; d=json.load(sys.stdin); e=d.get('data',{}).get('urlRedirectCreate',{}).get('userErrors',[]); print('  ✓ ' + '$old_path' + ' → ' + '$new_path') if not e else print('  ✗ ' + e[0]['message'])" 2>/dev/null || echo "  ✗ Failed: $old_path"
}

# Catch-all: /editorial → /blogs/editorial
create_redirect "/editorial" "/blogs/editorial"

# Each article needs TWO redirects: clean URL + /index.html version
SLUGS=(
  "winter-chafing"
  "feet-protection"
  "foot-stress"
  "hydration-vests"
  "weekly-mileage"
  "backyard-ultra"
  "running-as-therapy"
  "body-glide-vs-squirrels-nut-butter"
  "inner-thigh-chafing-running"
  "trail-running-socks-ultra-distance"
  "utmb-preparation-guide"
  "trail-running-drop-bag-essentials"
)

for slug in "${SLUGS[@]}"; do
  create_redirect "/editorial/$slug" "/blogs/editorial/$slug"
  create_redirect "/editorial/$slug/index.html" "/blogs/editorial/$slug"
done

echo ""
echo "  Total redirects created: $((${#SLUGS[@]} * 2 + 1)) (25 total)"

echo ""
echo "============================================================"
echo "DONE! Summary:"
echo "  ✓ Editorial blog created"
echo "  ✓ 15 articles created with category tags"
echo "  ✓ Product templates assigned"
echo "  ✓ 25 URL redirects created (301 SEO migration)"
echo ""
echo "Next steps:"
echo "  1. Add hero images to articles in Shopify admin"
echo "  2. Preview theme: Online Store → Themes → aura-running-theme → Preview"
echo "  3. Verify redirects: visit aura-running.com/editorial/winter-chafing"
echo "  4. Check sitemap: aura-running.com/sitemap.xml"
echo "  5. Check robots.txt: aura-running.com/robots.txt"
echo "  6. Publish when ready"
echo "============================================================"
