import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [topReporters, setTopReporters] = useState([]);

  useEffect(() => {
    api.get("/articles/public")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));

    api.get("/reporters/top")
      .then(res => setTopReporters(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Homepage</h1>

      <h2>Approved Articles</h2>
      {articles.map(article => (
        <div key={article.id} style={{border: "1px solid gray", margin: "10px", padding: "10px"}}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}

      <h2>Top Reporters</h2>
      {topReporters.map(reporter => (
        <div key={reporter.id}>
          <Link to={`/reporter/${reporter.id}`}>  
          ⭐ {reporter.name} 
          </Link>({reporter.averageRating})
        </div>
      ))}
    </div>
  );
}

export default Home;