import fetch from '@vercel/fetch';

export default function main(req, res) {
  const { url: try_url } = req.query;
  if (!decodeURIComponent(try_url + "").match(/^https:\/\//)) res.send(JSON.stringify({}));
  const ogp = fetch(decodeURIComponent(try_url))
    .then(text => {
      const el = new DOMParser().parseFromString(text, "text/html");
      const ogp = {};
      [...el.head.children].map(child => {
          const property = child.getAttribute("property");
          if (!(property + "").match(/^og:/)) return;
          ogp[property.replace(/^og:/, "")] = child.getAttribute("content");
      });
      ogp["image"] = (ogp["image"] + "").match(/:\/\//) ? ogp["image"] : ogp["url"] + ogp["image"];
      return ogp;
    })
  res.send(ogp);
}
