import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_USERNAME = 'jlaviole90';
const GITHUB_API = 'https://api.github.com';

interface GitHubRepo {
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    pushed_at: string;
    topics: string[];
}

interface ProjectInfo {
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    topics: string[];
    readme: string | null;
}

async function ghFetch(path: string, accept?: string): Promise<Response> {
    const headers: Record<string, string> = {
        Accept: accept ?? 'application/vnd.github+json',
        'User-Agent': 'jlav-io-site',
    };
    const token = process.env['GITHUB_TOKEN'];
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${GITHUB_API}${path}`, { headers });
}

async function fetchReadme(owner: string, repo: string): Promise<string | null> {
    try {
        const res = await ghFetch(
            `/repos/${owner}/${repo}/readme`,
            'application/vnd.github.html',
        );
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

async function fetchPinnedRepos(): Promise<ProjectInfo[] | null> {
    const token = process.env['GITHUB_TOKEN'];
    if (!token) return null;

    const query = `{
        user(login: "${GITHUB_USERNAME}") {
            pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                    ... on Repository {
                        name
                        url
                        description
                        primaryLanguage { name }
                        repositoryTopics(first: 10) {
                            nodes { topic { name } }
                        }
                    }
                }
            }
        }
    }`;

    try {
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!res.ok) return null;
        const json = await res.json();
        const nodes = json?.data?.user?.pinnedItems?.nodes;
        if (!Array.isArray(nodes) || nodes.length === 0) return null;

        const projects: ProjectInfo[] = await Promise.all(
            nodes.map(async (node: any) => ({
                name: node.name,
                url: node.url,
                description: node.description,
                language: node.primaryLanguage?.name ?? null,
                topics: node.repositoryTopics?.nodes?.map((t: any) => t.topic.name) ?? [],
                readme: await fetchReadme(GITHUB_USERNAME, node.name),
            })),
        );
        return projects;
    } catch {
        return null;
    }
}

async function fetchPublicRepos(): Promise<ProjectInfo[]> {
    const res = await ghFetch(
        `/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30&type=owner`,
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();

    const filtered = repos
        .filter((r) => !r.fork)
        .slice(0, 6);

    return Promise.all(
        filtered.map(async (r) => ({
            name: r.name,
            url: r.html_url,
            description: r.description,
            language: r.language,
            topics: r.topics ?? [],
            readme: await fetchReadme(GITHUB_USERNAME, r.name),
        })),
    );
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        let projects = await fetchPinnedRepos();
        if (!projects || projects.length === 0) {
            projects = await fetchPublicRepos();
        }

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
        return res.status(200).json(projects);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch projects' });
    }
}
