DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  tags TEXT NOT NULL,
  link TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

INSERT INTO resources (id, title, description, type, author, date, tags, link, likes) VALUES 
('1', 'AI 辅助古诗文教学的实践探索', '探讨如何利用生成式 AI 帮助学生理解古诗意境，提升审美鉴赏能力。包含具体课例分析与教学反思。', 'article', '张老师', '2024-03-15', '["古诗文", "AI教学", "教学案例"]', '#', 45),
('2', '高中语文写作素材库 (2024版)', '整理了2024年最新的高考作文素材，包括时事热点、名人名言、经典论据等，分类清晰，便于检索。', 'resource', '李教研', '2024-03-14', '["写作", "高考", "素材积累"]', '#', 120),
('3', 'DeepSeek 提示词编写指南', '专为语文教师设计的提示词编写教程，教你如何用精准的语言引导 AI 生成高质量的教学资源。', 'tool', 'AI 助教', '2024-03-13', '["AI工具", "提示词工程", "效率提升"]', '#', 89),
('4', '《红楼梦》整本书阅读任务群设计', '基于新课标要求的整本书阅读教学设计，利用 AI 辅助梳理人物关系、情节脉络，激发学生阅读兴趣。', 'article', '王老师', '2024-03-12', '["整本书阅读", "红楼梦", "教学设计"]', '#', 67),
('5', '现代文阅读答题技巧 AI 训练营', '利用 AI 生成模拟题，针对性训练学生的现代文阅读答题技巧，实时反馈，精准提升。', 'resource', '赵老师', '2024-03-11', '["现代文阅读", "答题技巧", "AI辅助"]', '#', 56),
('6', '文言文实词虚词智能查询工具', '基于大模型的文言文辅助工具，支持实词虚词的一键查询、例句解析和考点归纳。', 'tool', '技术组', '2024-03-10', '["文言文", "智能工具", "备考"]', '#', 102);
