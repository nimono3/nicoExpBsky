export default function main(req, res) {
  const { url: try_url } = req.query;
  if (!(try_url + "").match(/^https:\/\//)) res.send(JSON.stringify({}));
  fetch(try_url)
    .then(text => {
      const el = new DOMParser().parseFromString(text, "text/html");
      const ogp = {};
      [...el.head.children].map(child => {
          const property = child.getAttribute("property");
          if (!property.match(/^og:/)) return;
          ogp[property.replace(/^og:/, "")] = child.getAttribute("content");
      });
      ogp["image"] = ogp["image"].match(/:\/\//) ? ogp["image"] : ogp["url"] + ogp["image"];
      return ogp;
    })
    .then(ogp => res.send(ogp))
}
