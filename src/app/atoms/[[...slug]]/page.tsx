//'use client'
import Atom from '@/components/atom'
import Atoms from '@/components/atoms'

import { getProductsByAtomId, getAtoms } from '@/lib/atoms'

// Update the type to handle async params and searchParams
type PageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateStaticParams() {
  const { atoms } = await getAtoms()

  if (!atoms) {
    return []
  }

  const slugs = []
  for (const atom of atoms) {
    const { products } = await getProductsByAtomId(atom.id)
    if (!products) {
      slugs.push([atom.id])
      continue
    }

    for (const product of products) {
      slugs.push([atom.id, 'products', product.id])
    }

   // console.log(`Number of atomdddddsss found: ${atom.id}`);
  }

  const paths = slugs.map(slug => ({ slug }))
  return paths
}

// Update the Page component to only destructure params
export default async function Page({ params }: Pick<PageProps, 'params'>) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  
  if (!slug) {
    return <Atoms />
  }

  return <Atom slug={slug} />
}
