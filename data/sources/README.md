# Source references / 来源清单

`diffords-page-1.json` contains 24 factual listing references extracted from user-supplied Difford’s Guide search HTML. This is **not a complete recipe dataset**: quantities and mixing instructions were absent, and no image palettes have been verified. The frontend now uses 50 separately sourced recipes from the pinned teijo/iba-cocktails compilation; see `iba-provenance.json`. Difford’s listing references remain separate and are not complete recipe sources.

Image URLs are retained for reference; no third-party photo assets have been downloaded or embedded in the website. Source HTML, account information, cookies and scripts are not included.

To extract another saved search page (Python 3, standard library only):

```bash
python scripts/import_diffords_listing.py saved-search-page.html data/sources/another-page.json
```

这份清单只有酒名、材料名称、可选材料标记、来源链接和参考图片地址。尚未导入前端，也没有补写或推测用量和步骤。需要后续列表页及配方详情页，才能完成 50 款数据与配色核对。

`iba-provenance.json` records the pinned public source, download checksum, and original ingredient facts for the 50 imported recipes. Measurements are converted from cl to ml and instructions are paraphrased. Source links are visible in each recipe. No Difford’s photos are used.
