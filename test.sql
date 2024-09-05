select sum("count") as "Failures"
from 
  "getDataSciencePathways_time",
  "getDataSciencePathwaysMultilingual_time",
  "getDataScienceJobOptions_time",
  "getDataScienceJobOptionsMultilingual_time",
  "getMatchingOpportunitiesScores_time",
  "getTopSkills_time",
  "getTranslatedTopSkills_time",
  "searchJobTitles_time",
  "searchSkills_time",
  "searchSkillsV2_time",
  "selectSkillsForFeedback_time"
WHERE ("status" = 'fail')
GROUP BY "class"