import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SkillTableComponent.css";

const SkillTableComponent = () => {
  const [skillsData, setSkillsData] = useState({ skills: [], counts: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/job-skills"
        );
        setSkillsData(response.data);
      } catch (error) {
        console.error("Error fetching skills data:", error);
      }
    };
    fetchSkillsData();
  }, []);

  const filteredSkills = skillsData.skills
    .map((skill, index) => ({
      skill,
      count: skillsData.counts[index],
    }))
    .filter(({ skill }) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSkillClick = (skill) => {
    navigate(`/?skill=${encodeURIComponent(skill)}`);
  };

  return (
    <div className="container mt-4 py-5">
      <h1 className="mb-4 pt-5">Skills Data:</h1>
      <div className="mb-4 w-50">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search skills..."
        />
      </div>
      <div className="row">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 col-sm-12 mb-4"
              key={index}
              onClick={() => handleSkillClick(item.skill)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-container">
                <div className="card p-3 border rounded bg-light">
                  <h5>{item.skill}</h5>
                  <p>Count: {item.count}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No skills found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTableComponent;
