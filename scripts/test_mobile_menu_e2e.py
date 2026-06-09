#!/usr/bin/env python
"""
Standalone Playwright E2E checks for the mobile offcanvas menu.
Usage: python scripts/test_mobile_menu_e2e.py [base_url]
Default base_url: http://127.0.0.1:8000
"""

import sys
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright


def run(base_url: str) -> int:
    failures = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        def mobile_page():
            page = browser.new_page(viewport={"width": 390, "height": 844})
            page.goto(urljoin(base_url, "/"), wait_until="networkidle")
            return page

        def desktop_page():
            page = browser.new_page(viewport={"width": 1280, "height": 800})
            page.goto(urljoin(base_url, "/"), wait_until="networkidle")
            return page

        def open_menu(page):
            page.locator("#mobileMenuOpen").click()
            page.wait_for_selector("#mobileSidebar.show", timeout=5000)

        def menu_closed(page):
            return page.locator("#mobileSidebar").evaluate("el => !el.classList.contains('show')")

        def check(name, condition):
            if not condition:
                failures.append(name)
                print(f"FAIL: {name}")
            else:
                print(f"PASS: {name}")

        # Desktop checks
        page = desktop_page()
        check("desktop hamburger hidden", not page.locator("#mobileMenuOpen").is_visible())
        sidebar_display = page.locator("aside.sidebar").evaluate("el => getComputedStyle(el).display")
        check("desktop sidebar visible", sidebar_display in ("flex", "block"))
        page.close()

        # Mobile open
        page = mobile_page()
        check("mobile hamburger visible", page.locator("#mobileMenuOpen").is_visible())
        open_menu(page)
        check("open with hamburger", page.locator("#mobileSidebar").evaluate("el => el.classList.contains('show')"))

        # Close with X button
        page.locator("#mobileMenuClose").click()
        page.wait_for_function("() => !document.getElementById('mobileSidebar').classList.contains('show')")
        check("close with X button", menu_closed(page))

        # Close by tapping outside the drawer (right edge of screen)
        open_menu(page)
        page.mouse.click(380, 420)
        page.wait_for_function("() => !document.getElementById('mobileSidebar').classList.contains('show')")
        check("close with outside tap", menu_closed(page))

        # Close with nav link
        open_menu(page)
        page.locator('#mobileSidebar .sidebar-nav a[href="#about"]').click()
        page.wait_for_function("() => !document.getElementById('mobileSidebar').classList.contains('show')")
        check("close with nav link", menu_closed(page))

        # Re-open and close again (regression)
        open_menu(page)
        page.locator("#mobileMenuClose").click()
        page.wait_for_function("() => !document.getElementById('mobileSidebar').classList.contains('show')")
        check("close works on second open", menu_closed(page))

        page.close()
        browser.close()

    print(f"\n{len(failures)} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
    raise SystemExit(run(url))
