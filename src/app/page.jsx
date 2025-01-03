import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { Plus, Eye, LineChart, Play } from 'lucide-react'
import Image from 'next/image'

export default async function Home() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { 
        email: session.user.email 
      }
    })

    if (!admin) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl p-8 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">You don't have permission to view this page</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Try signing in with another email or contact your administrator for access.</p>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all"
              >
                Try Another Email
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true
      }
    })

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="relative w-full h-20 bg-black shadow-lg">
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
            <Image
              src="/logo1.png"
              alt="Left Logo"
              width={120}
              height={40}
              className="object-contain"
            />
            <Image
              src="/logo2.png"
              alt="Right Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative w-full h-48 md:h-64">
          <Image
            src="/logo1.png"
            alt="Dashboard Banner"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-semibold text-white">Your Forms</h2>
            <Link
              href="/forms/create"
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all hover:scale-[1.02] shadow-lg"
            >
              <Plus size={20} />
              Create New Form
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-700/50 transition-all hover:border-purple-500/50"
              >
                <h3 className="text-lg font-medium mb-2 text-white">{form.title}</h3>
                <p className="text-gray-400 mb-6 h-12 line-clamp-2">{form.description}</p>

                <div className="flex gap-4">
                  <Link
                    href={`/forms/${form.id}`}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                  <Link
                    href={`/forms/${form.id}/responses`}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <LineChart size={16} />
                    <span>Responses</span>
                  </Link>
                  <Link
                    href={`/forms/preview/${form.id}`}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Play size={16} />
                    <span>Preview</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {forms.length === 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl p-12 border border-gray-700/50 text-center">
              <p className="text-gray-400 mb-6">You haven't created any forms yet</p>
              <Link
                href="/forms/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all hover:scale-[1.02] shadow-lg"
              >
                <Plus size={20} />
                Create Your First Form
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    // Log the error server-side
    console.error('Error in Home page:', error)
    
    // Return a user-friendly error page
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">We're having trouble loading your dashboard</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }
}