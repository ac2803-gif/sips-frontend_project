"""Extract factual recipe references from a locally saved Difford's listing.

Usage: python scripts/import_diffords_listing.py saved-page.html output.json
No network requests, credentials, recipe quantities, or guessed instructions.
"""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

ORIGIN = 'https://www.diffordsguide.com'
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return ' '.join(' '.join(child.text() if isinstance(child, Node) else child for child in self.children).split())

    def find_all(self, predicate):
        found = [self] if predicate(self) else []
        for child in self.children:
            if isinstance(child, Node):
                found.extend(child.find_all(predicate))
        return found

    def has_class(self, name):
        return name in self.attrs.get('class', '').split()

class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for n in range(len(self.stack)-1, 0, -1):
            if self.stack[n].tag == tag:
                self.stack = self.stack[:n]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)

def extract(html):
    doc = Document()
    doc.feed(html)
    records = []
    seen = set()
    for card in doc.root.find_all(lambda n: n.has_class('link-box--cocktails')):
        titles = card.find_all(lambda n: n.has_class('link-box__title'))
        if not titles:
            continue
        links = titles[0].find_all(lambda n: n.tag == 'a' and '/cocktails/recipe/' in n.attrs.get('href', ''))
        if not links:
            continue
        url = urljoin(ORIGIN, links[0].attrs['href'])
        parsed = urlparse(url)
        if parsed.scheme != 'https' or parsed.netloc != 'www.diffordsguide.com':
            raise ValueError('Unexpected recipe destination')
        if url in seen:
            continue
        seen.add(url)
        images = card.find_all(lambda n: n.tag == 'img' and n.has_class('link-box__image'))
        ingredient_nodes = card.find_all(lambda n: n.has_class('link-box__ingredient-name'))
        ingredient_list = []
        for node in ingredient_nodes:
            optional = bool(node.find_all(lambda n: n.tag == 'span' and n.text().lower() == 'optional'))
            name = ' '.join(child.text() if isinstance(child, Node) else child for child in node.children if not (isinstance(child, Node) and child.tag == 'span' and child.text().lower() == 'optional'))
            ingredient_list.append({'name': ' '.join(name.split()), 'optional': optional})
        records.append({
            'name': titles[0].text(),
            'sourceUrl': url,
            'referenceImageUrl': urljoin(ORIGIN, images[0].attrs['src']) if images else None,
            'ingredients': ingredient_list,
            'status': 'listing-only; quantities, method and image palette not yet verified',
        })
    if not records:
        raise ValueError('No cocktail listing cards found; input may be a recipe or a blocked response')
    return records

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    raw = args.input.read_bytes()
    records = extract(raw.decode('utf-8-sig'))
    result = {
        'source': "Difford's Guide",
        'sourceType': 'user-supplied search listing HTML',
        'inputSha256': hashlib.sha256(raw).hexdigest(),
        'recipeCount': len(records),
        'completeRecipeCount': 0,
        'notes': 'Reference index only. No quantities or instructions were present in the supplied listing. Images are reference URLs, not downloaded or published photo assets. Not imported into the app until complete recipe details are verified.',
        'recipes': records,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Extracted {len(records)} unique listing references; 0 complete recipes.')

if __name__ == '__main__':
    main()
