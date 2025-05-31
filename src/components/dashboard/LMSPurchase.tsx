
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Play } from "lucide-react";

export const LMSPurchase = () => {
  const featuredContent = [
    {
      title: "Complete Guard System",
      instructor: "Master Silva",
      price: "$49.99",
      originalPrice: "$79.99",
      rating: 4.9,
      students: 1250,
      duration: "8 hours",
      level: "All Levels",
      discount: "38% OFF",
      thumbnail: "🛡️"
    },
    {
      title: "Competition Preparation",
      instructor: "Coach Ana",
      price: "$29.99",
      rating: 4.8,
      students: 850,
      duration: "4 hours", 
      level: "Intermediate",
      thumbnail: "🏆"
    },
  ];

  const subscriptions = [
    {
      name: "Premium Monthly",
      price: "$19.99/month",
      features: ["All courses", "Live sessions", "1-on-1 coaching"],
      popular: true
    },
    {
      name: "Basic Monthly", 
      price: "$9.99/month",
      features: ["Basic courses", "Community access"],
      popular: false
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-bjj-gold" />
          LMS Store
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Content */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Featured Courses</h4>
          <div className="space-y-3">
            {featuredContent.map((course, index) => (
              <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{course.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-bjj-navy text-sm">{course.title}</h5>
                      {course.discount && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {course.discount}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-bjj-gray mb-2">{course.instructor}</p>
                    
                    <div className="flex items-center space-x-2 text-xs text-bjj-gray mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-bjj-navy">{course.price}</span>
                        {course.originalPrice && (
                          <span className="text-xs text-bjj-gray line-through">
                            {course.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Subscriptions</h4>
          <div className="space-y-2">
            {subscriptions.map((sub, index) => (
              <div key={index} className={`border rounded-lg p-3 ${sub.popular ? 'border-bjj-gold bg-bjj-gold/5' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-bjj-navy text-sm">{sub.name}</h5>
                    {sub.popular && (
                      <Badge className="bg-bjj-gold text-bjj-navy text-xs">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold text-bjj-navy">{sub.price}</span>
                </div>
                
                <ul className="text-xs text-bjj-gray space-y-1 mb-3">
                  {sub.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-1">
                      <div className="h-1 w-1 bg-bjj-gold rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  size="sm" 
                  className={`w-full ${sub.popular ? 'bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy' : ''}`}
                  variant={sub.popular ? 'default' : 'outline'}
                >
                  Subscribe
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
