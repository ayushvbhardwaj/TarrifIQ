import os
from dotenv import load_dotenv
from eventregistry import *

load_dotenv()

EVENT_REGISTRY_API_KEY = os.getenv("EVENT_REGISTRY_API_KEY")

print(f"Key loaded: {'Yes' if EVENT_REGISTRY_API_KEY else 'No'}")

er = EventRegistry(apiKey=EVENT_REGISTRY_API_KEY, allowUseOfArchive=False)

q = QueryArticlesIter(
    keywords=QueryItems.OR([
        "tariff", "trade war", "customs duty", "import duty"
    ]),
    sourceLocationUri=QueryItems.OR([
        "http://en.wikipedia.org/wiki/United_Kingdom",
        "http://en.wikipedia.org/wiki/United_States",
        "http://en.wikipedia.org/wiki/Canada",
        "http://en.wikipedia.org/wiki/India"
    ]),
    ignoreSourceGroupUri="paywall/paywalled_sources",
    dataType=["news", "pr"]
)

print("Executing query...")
articles = []
for article in q.execQuery(er, sortBy="date", sortByAsc=False, maxItems=5):
    articles.append(article)
    print(f"- {article.get('title')}")

print(f"Total found: {len(articles)}")
