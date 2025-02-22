import asyncio
from playwright.async_api import async_playwright
import json

async def load_cookies_and_scrape(cookie_file, target_url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        with open(cookie_file, "r") as f:
            cookies = json.load(f)
        await context.add_cookies(cookies)

        page = await context.new_page()
        await page.goto(target_url)
        await page.wait_for_selector("#stats-container")

        analytics_data = await page.evaluate("""() => {
            let data = {};
            let viewsEl = document.querySelector('[data-test-id="views"]') || document.querySelector('#views-value');
            data.views = viewsEl ? viewsEl.innerText.trim() : 'N/A';
            let likesEl = document.querySelector('[data-test-id="likes"]') || document.querySelector('#likes-value');
            data.likes = likesEl ? likesEl.innerText.trim() : 'N/A';
            let dislikesEl = document.querySelector('[data-test-id="dislikes"]') || document.querySelector('#dislikes-value');
            data.dislikes = dislikesEl ? dislikesEl.innerText.trim() : 'N/A';
            let subscribersEl = document.querySelector('[data-test-id="subscribers-gained"]') || document.querySelector('#subscribers-value');
            data.subscribersGained = subscribersEl ? subscribersEl.innerText.trim() : 'N/A';
            return data;
        }""")
        
        await browser.close()
        return analytics_data
