# 篮球联赛数据展示系统

这是一个用于展示篮球联赛数据的静态网站系统。通过修改数据文件，可以轻松更新联赛、球队、球员和比赛的信息。

## 项目特点

- 纯静态网站，无需后端服务
- 数据更新通过修改数据文件实现
- 支持多联赛管理
- 集中化的球员信息管理
- 部署在 Cloudflare Pages 上，方便访问

## 技术栈

- React 19
- TypeScript
- Vite
- TailwindCSS
- HeadlessUI
- Chart.js（数据可视化）

## 项目结构

```
src/
├── assets/
│   ├── players/           # 球员头像目录（共用）
│   └── leagues/           # 联赛资源目录
│       ├── league1/       # 联赛1的资源
│       │   ├── teams/     # 该联赛的球队logo
│       │   └── other/     # 该联赛的其他资源
│       └── league2/       # 联赛2的资源
│           ├── teams/     # 该联赛的球队logo
│           └── other/     # 该联赛的其他资源
├── data/                  # 数据文件目录
│   ├── playerBase.json    # 球员库数据
│   ├── leagues.json      # 联赛数据
│   ├── teams.json        # 球队数据
│   └── matches.json      # 比赛数据
└── components/           # React 组件
```

## 数据结构

### 1. 球员库 (playerBase.json)
```json
{
  "player1": {
    "name": "球员姓名",
    "avatar": "/players/player1.jpg"
  }
}
```

### 2. 联赛表 (leagues.json)
```json
{
  "league1": {
    "name": "联赛名称",
    "season": "赛季信息",
    "teams": ["team1", "team2"],
    "matches": ["match1", "match2"]
  }
}
```

### 3. 球队表 (teams.json)
```json
{
  "team1": {
    "leagueId": "league1",
    "name": "球队名称",
    "logo": "/leagues/league1/teams/team1.svg",
    "players": [
      {
        "id": "player1",
        "number": "球衣号码"
      }
    ]
  }
}
```

### 4. 比赛记录 (matches.json)
```json
{
  "match1": {
    "leagueId": "league1",
    "time": "比赛时间",
    "homeTeam": "team1",
    "awayTeam": "team2",
    "score": {
      "home": 80,
      "away": 75
    },
    "playerStats": {
      "player1": {
        "played": true,
        "points": 15,
        "rebounds": 8
      }
    }
  }
}
```

## 资源管理指南

### 球员头像管理
- 存放位置：`src/assets/players/`
- 命名规则：使用球员ID作为文件名
- 推荐格式：JPEG 或 WebP
- 推荐尺寸：200x200 像素

### 联赛资源管理
1. **目录结构**
   - 每个联赛有独立的资源目录
   - 联赛目录使用联赛ID命名
   - 球队logo统一存放在联赛目录下的 teams 文件夹中

2. **球队Logo规范**
   - 存放位置：`src/assets/leagues/{league_id}/teams/`
   - 推荐格式：SVG（首选）或 PNG（需要透明背景时）
   - PNG尺寸建议：400x400像素
   - 文件大小：控制在100KB以内

3. **命名规范**
   - 联赛目录：使用联赛ID，如 `city_league`
   - 球队Logo：使用球队ID，如 `warriors.svg`

## 数据更新指南

### 添加新球员
1. 将球员头像添加到 `src/assets/players/` 目录
2. 在 `playerBase.json` 中添加球员信息
3. 图片命名规范：使用球员ID作为文件名

### 创建新联赛
1. 在 `leagues.json` 中添加新联赛信息
2. 在 `src/assets/leagues/` 下创建联赛资源目录
3. 创建参赛球队并添加球队logo
4. 关联球员和球队

### 记录比赛数据
1. 在 `matches.json` 中创建新比赛记录
2. 填写比赛基本信息
3. 记录参赛球员数据

## 开发指南

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 部署流程
1. 修改数据文件
2. 提交代码到仓库
3. Cloudflare Pages 自动构建和部署

## 维护注意事项

1. 数据一致性
   - 确保球员ID在所有文件中保持一致
   - 检查联赛、球队和比赛的关联关系

2. 资源管理
   - 定期清理未使用的图片资源
   - 保持资源命名规范
   - 优化图片大小和质量
   - 确保联赛资源放在正确的目录中

3. 版本控制
   - 每次更新后提交所有相关文件
   - 保持数据文件和资源文件的同步

## License

[MIT License](LICENSE)
