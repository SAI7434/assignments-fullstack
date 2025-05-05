const axios = require('axios');
require('dotenv').config();

// Function to extract data using OpenRouter
const extractDataFromAI = async (resumeText) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', 
        messages: [
          {
            role: 'user',
            content: `Extract the following structured data from the resume text below:
{
  "skills": [{"name": "", "proficiency": ""}],
  "work_experience": [{"title": "", "company": "", "start_date": "", "end_date": "", "description": ""}],
  "education": [{"degree": "", "field": "", "institution": "", "year": ""}]
}
Resume Text:
${resumeText}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    throw new Error('Resume parsing failed.');
  }
};

// Function to handle missing data by providing default values
const handleMissingData = (data) => {
  if (!data.skills || data.skills.length === 0) {
    data.skills = [{ name: "Not provided", proficiency: "Intermediate" }];
  }
  if (!data.work_experience || data.work_experience.length === 0) {
    data.work_experience = [{ title: "Not available", company: "Not available", start_date: "Not available", end_date: "Not available", description: "Not provided" }];
  }
  if (!data.education || data.education.length === 0) {
    data.education = [{ degree: "Not available", field: "Not available", institution: "Not available", year: "Not available" }];
  }
  return data;
};

// Function to validate skills and ensure proficiency levels are correct
const validateSkills = (skills) => {
  const validProficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  
  return skills.map(skill => {
    return {
      name: skill.name.trim(),
      proficiency: validProficiencyLevels.includes(skill.proficiency) ? skill.proficiency : "Intermediate"
    };
  });
};

// Function to validate work experience dates and ensure consistency
const validateWorkExperience = (workExperience) => {
  return workExperience.map(exp => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date ? new Date(exp.end_date) : new Date();

    // Check if start date is before end date
    if (startDate > endDate) {
      exp.end_date = null; 
    }

    return exp;
  });
};

// Function to validate and standardize education degrees
const validateEducation = (education) => {
  const degreeMap = {
    "B.Tech": "Bachelor of Technology",
    "B.E.": "Bachelor of Engineering",
    "M.Tech": "Master of Technology",
  };

  return education.map(edu => {
    return {
      ...edu,
      degree: degreeMap[edu.degree] || edu.degree, 
      year: edu.year > new Date().getFullYear() ? null : edu.year 
    };
  });
};

// Function to standardize skill names
const standardizeSkills = (skills) => {
  const standardSkills = {
    "JS": "JavaScript",
    "NodeJS": "Node.js",
    "ReactJS": "React",
    "Python3": "Python"
  };

  return skills.map(skill => ({
    name: standardSkills[skill.name] || skill.name,
    proficiency: skill.proficiency
  }));
};

// Function to standardize work experience
const standardizeWorkExperience = (workExperience) => {
  return workExperience.map(exp => ({
    ...exp,
    title: exp.title.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()), // Capitalize title
    company: exp.company.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) // Capitalize company name
  }));
};

// Main parsing function
const parseResume = async (resumeText) => {
  try {
    const rawData = await extractDataFromAI(resumeText); // AI extraction
    let validatedData = handleMissingData(rawData); // Handle missing data
    validatedData.skills = validateSkills(validatedData.skills); // Validate skills
    validatedData.work_experience = validateWorkExperience(validatedData.work_experience); // Validate work experience
    validatedData.education = validateEducation(validatedData.education); // Validate education
    validatedData.skills = standardizeSkills(validatedData.skills); // Standardize skills
    validatedData.work_experience = standardizeWorkExperience(validatedData.work_experience); // Standardize work experience
    return validatedData;
  } catch (error) {
    console.error('Error during parsing:', error);
    throw new Error('Resume parsing failed.');
  }
};

module.exports = { parseResume };
