import{_ as e,c as a,o as t,ak as i}from"./chunks/framework.B3JW-Vb0.js";const o="/weacast/assets/domain-model.DBpamJ-k.svg",g=JSON.parse('{"title":"Domain model","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/domain-model.md","filePath":"architecture/domain-model.md"}'),r={name:"architecture/domain-model.md"},n=i('<h1 id="domain-model" tabindex="-1">Domain model <a class="header-anchor" href="#domain-model" aria-label="Permalink to &quot;Domain model&quot;">​</a></h1><p>The <strong>domain model</strong> is a set of high-level abstractions that describes selected aspects of a sphere of activity, more specifically <a href="https://en.wikipedia.org/wiki/Numerical_weather_prediction" target="_blank" rel="noreferrer">numerical weather prediction</a> for Weacast. It is a representation of meaningful real-world concepts pertinent to the domain that are modeled in the software. The concepts include the data involved in the business and rules the business uses in relation to that data.</p><p>The class diagram used to represent the domain model in the <a href="https://en.wikipedia.org/wiki/Unified_Modeling_Language" target="_blank" rel="noreferrer">Unified Modeling Language</a> (UML) is presented afterwards. The Weacast domain model is implemented as a hybridation between <a href="https://en.wikipedia.org/wiki/Object-oriented_programming" target="_blank" rel="noreferrer">objects</a> and <a href="https://en.wikipedia.org/wiki/Aspect-oriented_software_development" target="_blank" rel="noreferrer">cross-cutting concerns</a> within a layer that uses a lower-level layer for <a href="./data-model-view.html">persistence</a> and <em>publishes</em> an <a href="./../api/README.html">API</a> to a higher-level layer to gain access to the data and behavior of the model.</p><p><img src="'+o+'" alt="Domain model"></p><p>To get into the details of this model look at the <a href="./data-model-view.html">persisted data model</a> and the provided <a href="./../api/README.html">API</a>.</p>',5),s=[n];function d(l,m,h,c,p,_){return t(),a("div",null,s)}const u=e(r,[["render",d]]);export{g as __pageData,u as default};
