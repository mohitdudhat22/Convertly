import React from 'react'
import Icons from '../Icons'

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const Features = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FeatureCard
            icon={Icons.Infinity}
            title="Free & Unlimited"
            description="No hidden fees, no watermarks. Use all tools without limits"
          />
          <FeatureCard
            icon={Icons.Security}
            title="Secure & Private"
            description="Your files are auto-deleted after 1 hour. 100% privacy guaranteed"
          />
          <FeatureCard
            icon={Icons.Work}
            title="Works Everywhere"
            description="Fully online, no installation needed. Works on mobile & desktop"
          />
          <FeatureCard
            icon={Icons.FastnEasy}
            title="Fast & Easy"
            description="No learning curve, instant results. Just upload and get started!"
          />
        </div>
      </div>
    </div>
  )
}

export default Features 