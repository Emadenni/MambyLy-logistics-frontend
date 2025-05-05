import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';

// Creare il SitemapStream
const sitemap = new SitemapStream({ hostname: 'https://www.mambylysolutions.se' });

// Creare lo stream di scrittura per il file sitemap.xml
const writeStream = fs.createWriteStream('./public/sitemap.xml');

// Pipe il SitemapStream nel WriteStream
sitemap.pipe(writeStream);

// Aggiungere le URL al SitemapStream
sitemap.write({ url: '/home', changefreq: 'daily', priority: 0.7 });
sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

// Terminare lo stream
sitemap.end();

// Usare streamToPromise per verificare quando la scrittura è finita
streamToPromise(sitemap).then(() => {
  console.log('Sitemap generated!');
}).catch((error) => {
  console.error('Error generating sitemap:', error);
});
