import { initialProjects } from '../src/projects.js'

export default function handler(_request, response) {
  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
  response.status(200).json(initialProjects.map(({ id, title, category, year, image, description, liveUrl }, index) => ({
    id,
    title,
    category,
    year,
    image,
    description,
    featured: 1,
    live_url: liveUrl ?? null,
    sort_order: index,
  })))
}
